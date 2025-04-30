import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Object, default: { likes: 0, dislikes: 0 } })
  reactions: {
    likes: number;
    dislikes: number;
  };

  @Prop({ default: 0 })
  views: number; 
}

export const PostSchema = SchemaFactory.createForClass(Post);