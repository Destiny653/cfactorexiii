import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './post.controller';
import { PostsService } from './post.service';
import { Post, PostSchema } from '../post/Schema/post.schema';
import { CommentController } from '../comment/comment.controller';
import { CommentsService } from '../comment/comment.service';
import { Comment, CommentSchema } from '../comment/schema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PostsController, CommentController],
  providers: [PostsService, CommentsService],
})
export class PostsModule {}