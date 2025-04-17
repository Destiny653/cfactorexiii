import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './Schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  // Create a new post
  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  // Get all posts
  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  // Get a single post by ID
  async findOne(id: string ): Promise<Post | null> {
    return this.postModel.findById(id).exec();
  }

  // Update a post
  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
  }

  // Delete a post
  async delete(id: string): Promise<Post | null> {
    return this.postModel.findByIdAndDelete(id).exec();
  }

  // Increment likes/dislikes/views
  async reactToPost(id: string, reaction: 'likes' | 'dislikes' | 'views'): Promise<Post | null> {
    return this.postModel.findByIdAndUpdate(
      id,
      { $inc: { [`reactions.${reaction}`]: 1 } },
      { new: true },
    ).exec();
  }
}