import { Controller, Post, Body, Get, Query, UseGuards, HttpException, HttpStatus, Redirect } from '@nestjs/common';
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
  @Redirect() // Will redirect after verification
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new HttpException(
        'Verification token is required',
        HttpStatus.BAD_REQUEST
      );
    }

    console.log('Token:', token);
  
    try {
      const result = await this.authService.verifyEmail(token);
      console.log('Verification result:', result); 
      return {
        url: process.env.FRONTEND_VERIFICATION_SUCCESS_URL || '/verified-success',
        statusCode: 302,
        result
      };
    } catch (error) {
      return {
        statusCode: 302,
        message: error.message,
        url: process.env.FRONTEND_VERIFICATION_FAILURE_URL || '/verified-failed?error=' + encodeURIComponent(error.message),
      };
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