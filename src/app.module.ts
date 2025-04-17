import * as dotenv from 'dotenv';
dotenv.config()
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';

const mongoUri = process.env.MONGODB_URI;
// if (!mongoUri) {
//   throw new Error('MONGODB_URI environment variable is not defined');
// }

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MongooseModule.forRoot(mongoUri || 'mongodb://localhost:27017/dashboard'),
    ProductModule,
  ],
})
export class AppModule {}