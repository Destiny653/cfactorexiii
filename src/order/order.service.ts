import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { UserService } from '../user/user.service'; 
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaymentService } from './payunit.payment';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private usersService: UserService,
    private paymentService: PaymentService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<{ order: Order; paymentRedirectUrl?: string }> {
    // 1. Validate user exists
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // 2. Calculate order totals
    const { items, shippingMethod } = createOrderDto;
    
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountTotal = items.reduce((sum, item) => {
      const discount = item.discountPercentage || 0;
      return sum + (item.price * item.quantity * discount) / 100;
    }, 0);
    
    const shippingCost = shippingMethod === 'express' ? 15 : 0;
    const total = subtotal - discountTotal + shippingCost;

    // 3. Create order record (unpaid status)
    const order = new this.orderModel({
      user: userId,
      ...createOrderDto,
      subtotal,
      discountTotal,
      shippingCost,
      total,
      status: 'pending_payment',
      paymentStatus: 'unpaid',
    });

    const savedOrder = await order.save();
    this.logger.log(`Order ${savedOrder._id} created for user ${userId}`);

    try {
      // 4. Initiate payment - ensure mapping matches PaymentProduct interface
      const paymentResult = await this.paymentService.initiatePayment(
        items.map(item => ({
          price: item.price,
          title: item.name,
          thumbnail: item.thumbnail || 'default-thumbnail.jpg', // Provide default value
          description: item.description || '',
          quantity: item.quantity,
        })),
        total,
        userId
      );

      // 5. Update order with payment reference
      savedOrder.set('paymentReference', paymentResult.transactionId);
      await savedOrder.save();

      return {
        order: savedOrder.toObject(), // Convert to plain object
        paymentRedirectUrl: paymentResult.redirectUrl,
      };

    } catch (paymentError) {
      this.logger.error(`Payment failed for order ${savedOrder._id}: ${paymentError.message}`);
      
      // Update order status to reflect payment failure
      savedOrder.set('status', 'payment_failed');
      await savedOrder.save();

      throw new HttpException(
        {
          message: 'Payment initiation failed',
          orderId: savedOrder._id,
          error: paymentError.response?.data || paymentError.message,
        },
        HttpStatus.PAYMENT_REQUIRED
      );
    }
  }
  async findAll(userId?: string): Promise<Order[]> {
    const query = userId ? { user: userId } : {};
    return this.orderModel.find(query).populate('user', 'name email').exec();
  }

  async findOne(id: string): Promise<Order | null> {
    return this.orderModel.findById(id).populate('user', 'name email').exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order | null> {
    const updates: any = { ...updateOrderDto };

    if (updateOrderDto.isPaid) {
      updates.paidAt = new Date();
    }

    if (updateOrderDto.isDelivered) {
      updates.deliveredAt = new Date();
    }

    return this.orderModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.orderModel.findByIdAndDelete(id).exec();
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | null> {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    return this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }
}