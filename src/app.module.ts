import * as dotenv from 'dotenv';
dotenv.config()
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { PostModule } from './post/post.module';  
import { CommentModule } from './comment/comment.module'; 
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';  
import { OrdersModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'Production'}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    ProductModule,
    PostModule,
    CommentModule,
    UserModule,
    AuthModule,
    OrdersModule,
  ] 
})
export class AppModule {}
