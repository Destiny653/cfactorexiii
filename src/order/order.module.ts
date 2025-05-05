// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './order.controller'; 
import { UserModule } from 'src/user/user.module';
import { Order, OrderSchema } from './schema/order.schema';
import { OrdersService } from './order.service';
import { PaymentService } from './payunit.payment';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    UserModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PaymentService],
  exports: [OrdersService],
})
export class OrdersModule {}