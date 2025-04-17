import * as dotenv from 'dotenv';
dotenv.config()
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { PostsModule } from './post/post.module'; 
import { CommentController } from './comment/comment.controller';
import { CommentModule } from './comment/comment.module';
import { CommentsService } from './comment/comment.service'; 

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
    PostsModule,
    CommentModule,
  ],
  controllers: [CommentController],
  providers: [CommentsService],
})
export class AppModule {}