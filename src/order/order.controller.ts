// src/orders/orders.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseGuards,
    Req,
    UnauthorizedException,
    NotFoundException,
    Logger,
  } from '@nestjs/common'; 
  import { CreateOrderDto } from './dto/create-order.dto';
  import { UpdateOrderDto } from './dto/update-order.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
import { OrdersService } from './order.service';
  
  @Controller('orders')
  export class OrdersController {
    private readonly logger = new Logger(OrdersController.name);
    constructor(private readonly ordersService: OrdersService) {}
  
    @Post() 
    async create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
      try {
        const result = await this.ordersService.create(createOrderDto.userId, createOrderDto);

        this.logger.log(`Order ${result.order} created for user ${createOrderDto.userId}`);
        
        if (result.paymentRedirectUrl) {
          return { 
            success: true,
            order: result.order,
            paymentRedirect: result.paymentRedirectUrl 
          };
        }
    
        return { success: true, order: result.order };
      } catch (error) {
        this.logger.error(`Order creation failed: ${error.message}`);
        throw error.messsage; // Let NestJS handle the HTTP exception
      }
    }
  
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin') // Now using string literal
    async findAll() {
      return this.ordersService.findAll();
    }
  
    @Get('my-orders')
    @UseGuards(JwtAuthGuard)
    async getUserOrders(@Req() req) {
      return this.ordersService.getUserOrders(req.user._id);
    }
  
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Req() req) {
      const order = await this.ordersService.findOne(id);

      if (!order) {
        throw new NotFoundException('Order not found');
      }
      
      // Check if user is admin or order owner
      if ( req.user.role !== 'admin' && order.user.toString() !== req.user._id) {
        throw new UnauthorizedException('You are not authorized to view this order');
      }
      
      return order;
    }
  
    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
      return this.ordersService.update(id, updateOrderDto);
    }
  
    @Put(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async updateStatus(@Param('id') id: string, @Body('status') status: string) {
      return this.ordersService.updateOrderStatus(id, status);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async remove(@Param('id') id: string) {
      return this.ordersService.remove(id);
    }
  }