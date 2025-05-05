// src/orders/dto/create-order.dto.ts
export class OrderItemDto {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    thumbnail?: string;
    discountPercentage?: number;
    description: string;
  }
  
  export class ShippingAddressDto {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }
  
  export class CreateOrderDto {
    items: OrderItemDto[];
    shippingAddress: ShippingAddressDto;
    shippingMethod: 'standard' | 'express';
    paymentMethod: string;
    userId: string;
  }