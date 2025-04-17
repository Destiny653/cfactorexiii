import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schema/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  // Create a new comment
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const createdComment = new this.commentModel(createCommentDto);
    return createdComment.save();
  }

  // Get all comments for a post
  async findByPostId(postId: string): Promise<Comment[]> {
    return this.commentModel.find({ postId }).exec();
  }

  // Get a single comment by ID
  async findOne(id: string): Promise<Comment | null> {
    return this.commentModel.findById(id).exec();
  }

  // Update a comment
  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment | null> {
    return this.commentModel.findByIdAndUpdate(id, updateCommentDto, { new: true }).exec();
  }

  // Delete a comment
  async delete(id: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndDelete(id).exec();
  }

  // Like a comment
  async likeComment(id: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true },
    ).exec();
  }
}