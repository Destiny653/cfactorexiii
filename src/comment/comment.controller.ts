import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
  } from '@nestjs/common';
  import { CommentService } from './comment.service';
  import { CreateCommentDto } from './dto/create-comment.dto';
  import { UpdateCommentDto } from './dto/update-comment.dto';
  
  @Controller('comments')
  export class CommentController {
    constructor(private readonly commentService: CommentService) {}
  
    @Post()
    async create(@Body() createCommentDto: CreateCommentDto) {
      return this.commentService.create(createCommentDto);
    }
  
    @Get()
    async findAll() {
      return this.commentService.findAll();
    }
  
    @Get(':id')
    async findById(@Param('id') id: string) {
      return this.commentService.findById(id);
    }
  
    @Get('post/:postId')
    async findByPostId(@Param('postId') postId: string) {
      return this.commentService.findByPostId(postId);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateCommentDto: UpdateCommentDto,
    ) {
      return this.commentService.update(id, updateCommentDto);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.commentService.delete(id);
    }
  
    @Post(':id/like')
    async likeComment(@Param('id') id: string) {
      return this.commentService.likeComment(id);
    }
  
    @Post(':id/unlike')
    async unlikeComment(@Param('id') id: string) {
      return this.commentService.unlikeComment(id);
    }
  }