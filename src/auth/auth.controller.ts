import { Controller, Post, Body, Get, Query, UseGuards, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard'; 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    if (!token) {
       res.redirect(`${process.env.CORS_ORIGIN}/register?error=Token required`);
       return {
        message: 'Invalid token verificaton',
        success: false,
        status: 401
       }
    }
  
    try {
      await this.authService.verifyEmail(token);
      // Successful verification - redirect to frontend success page
      return res.redirect(`${process.env.CORS_ORIGIN}/verification-success`);
    } catch (error) {
      // Failed verification
      return res.redirect(
        `${process.env.CORS_ORIGIN}/verification-failed?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')  // Now properly imported
  @Get('admin-only')
  async adminOnlyRoute() {
    return { message: 'This is a protected route for admins' };
  }
}