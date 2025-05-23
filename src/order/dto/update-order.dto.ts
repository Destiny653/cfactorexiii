// src/orders/dto/update-order.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  isPaid?: boolean;
  isDelivered?: boolean;
  status?: string;
}