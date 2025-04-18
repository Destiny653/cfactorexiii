import {Controller,Get,Post,Body,Param,Put,Delete,Query} from '@nestjs/common';
  import { UserService } from './user.service'; 
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
      return this.userService.create(createUserDto);
    }
  
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
  
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.userService.update(id, updateUserDto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.userService.delete(id);
    }
  
  // Remove these authentication-related endpoints
  // @Post('verify/:token')
  // async verify(@Param('token') token: string) {
  //   return this.userService.verifyUser(token);
  // }
  
  // @Post('reset-password')
  // async resetPassword(
  //   @Query('token') token: string,
  //   @Body('newPassword') newPassword: string,
  // ) {
  //   return this.userService.resetPassword(token, newPassword);
  // }
  }