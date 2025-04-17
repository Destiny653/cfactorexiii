import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document { 
    
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  discountPercentage: number;

  @Prop()
  rating: number;

  @Prop()
  stock: number;

  @Prop([String])
  tags: string[];

  @Prop()
  brand: string;

  @Prop()
  sku: string;

  @Prop()
  weight: number;

  @Prop({
    type: {
      width: Number,
      height: Number,
      depth: Number,
    },
  })
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };

  @Prop()
  warrantyInformation: string;

  @Prop()
  shippingInformation: string;

  @Prop()
  availabilityStatus: string;

  @Prop([
    {
      rating: Number,
      comment: String,
      date: Date,
      reviewerName: String,
      reviewerEmail: String,
    },
  ])
  reviews: {
    rating: number;
    comment: string;
    date: Date;
    reviewerName: string;
    reviewerEmail: string;
  }[];

  @Prop()
  returnPolicy: string;

  @Prop()
  minimumOrderQuantity: number;

  @Prop({
    type: {
      createdAt: Date,
      updatedAt: Date,
      barcode: String,
      qrCode: String,
    },
  })
  meta: {
    createdAt: Date;
    updatedAt: Date;
    barcode: string;
    qrCode: string;
  };

  @Prop([String])
  images: string[];

  @Prop()
  thumbnail: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);