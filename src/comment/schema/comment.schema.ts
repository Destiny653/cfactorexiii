import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Post } from '../../post/Schema/post.schema'; // Adjust the import path as necessary

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true })
  body: string;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId; // Reference to Post

  @Prop({ default: 0 })
  likes: number;

  @Prop({
    type: {
      id: { type: Number, required: true },
      username: { type: String, required: true },
      fullName: { type: String, required: true },
    },
    required: true,
  })
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

export const CommentSchema = SchemaFactory.createForClass(Comment);