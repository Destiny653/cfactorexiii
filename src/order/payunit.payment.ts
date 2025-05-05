import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface PaymentProduct {
  price: number;
  title: string; 
  description: string;
  quantity: number;
  thumbnail: string;
}

interface PaymentResponse {
  redirectUrl: string;
  transactionId: string;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  
  constructor(private configService: ConfigService) {}

  async initiatePayment(
    products: PaymentProduct[],
    totalAmount: number,
    userId: string
  ): Promise<{ transactionId: string; redirectUrl: string }> {
    // Validate inputs
    if (!products?.length || totalAmount <= 0) {
      throw new Error('Invalid payment parameters');
    }

    const transactionId = uuidv4(); // Generate unique ID for each transaction
    const baseUrl = this.configService.get<string>('PAYMENT_GATEWAY_URL');
    
    const payload = {
      amount: totalAmount,
      products,
      userId,
      total_amount: totalAmount,
      currency: "XAF",
      mode: "payment",
      transaction_id: transactionId,
      cancel_url: `${this.configService.get('CORS_ORIGIN')}/payment/cancel`,
      success_url: `${this.configService.get('CORS_ORIGIN')}/payment/success`,
      return_url: this.configService.get('PAYMENT_WEBHOOK_URL'),
      notify_url: this.configService.get('PAYMENT_WEBHOOK_URL'),
      items: products.map(product => this.mapProductToPayload(product)),
      meta: {
        user_id: userId,
        phone_number_collection: false,
        address_collection: false
      }
    };

    try {
      const response = await axios.post(
        `${baseUrl}/api/gateway/checkout/initialize`,
        payload,
        this.getRequestConfig()
      );

      this.logger.log(`Payment initiated for user ${userId}, transaction ${transactionId}`);
      
      return {
        redirectUrl: response.data.data.redirect,
        transactionId: transactionId
      };
    } catch (error) {
      this.handlePaymentError(error, transactionId);
      throw new Error('Payment initiation failed');
    }
  }

  private mapProductToPayload(product: PaymentProduct) {
    return {
      price_description: {
        unit_amount: Math.round(product.price) // Convert to cents if needed
      },
      product_description: {
        name: product.title.substring(0, 100), // Limit length
        image_url: product.thumbnail,
        about_product: product.description.substring(0, 255)
      },
      quantity: product.quantity
    };
  }

  private getRequestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.configService.get('PAYMENT_API_TOKEN'),
        'Authorization': `Basic ${this.getBasicAuthCredentials()}`,
        'mode': 'live'
      },
      timeout: 10000 // 10 seconds timeout
    };
  }

  private getBasicAuthCredentials(): string {
    const apiUser = this.configService.get('PAYMENT_API_USER');
    const apiPassword = this.configService.get('PAYMENT_API_PASSWORD');
    return Buffer.from(`${apiUser}:${apiPassword}`).toString('base64');
  }

  private handlePaymentError(error: AxiosError, transactionId: string) {
    if (error.response) {
      this.logger.error(
        `Payment failed for transaction ${transactionId}: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      );
    } else {
      this.logger.error(
        `Payment network error for transaction ${transactionId}: ${error.message}`
      );
    }
  }
}