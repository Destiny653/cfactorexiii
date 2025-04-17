import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PostsService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }

  @Post(':id/like')
  likePost(@Param('id') id: string) {
    return this.postsService.reactToPost(id, 'likes');
  }

  @Post(':id/dislike')
  dislikePost(@Param('id') id: string) {
    return this.postsService.reactToPost(id, 'dislikes');
  }

  @Post(':id/view')
  viewPost(@Param('id') id: string) {
    return this.postsService.reactToPost(id, 'views');
  }
}