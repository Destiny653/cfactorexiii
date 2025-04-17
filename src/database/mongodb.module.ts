import * as dotenv from 'dotenv';
dotenv.config()
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const mongoUri = process.env.MONGO_URI;
console.log('MongoDB URI:', mongoUri);
if (!mongoUri) {
  throw new Error('MONGO_URI environment variable is not defined');
}

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, {
    }),
  ],
  exports: [MongooseModule],
})
export class MongoDbModule {}