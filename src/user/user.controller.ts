import {Controller,Get,Post,Body,Param,Put,Delete,Query} from '@nestjs/common';
  import { UserService } from './user.service';  
  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {} 
    @Get()
    async findAll() {
      return this.userService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.userService.findById(id);
    }
  
    @Get('email/:email')
    async findByEmail(@Param('email') email: string) {
      return this.userService.findByEmail(email);
    }
  
    @Get('username/:username')
    async findByUsername(@Param('username') username: string) {
      return this.userService.findByUsername(username);
    } 

    @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.userService.delete(id);
    } 
  }