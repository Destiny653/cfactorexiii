import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  verifyEmail(token: string) {
    throw new Error('Method not implemented.');
  }
  forgotPassword(email: string) {
    throw new Error('Method not implemented.');
  }
  resetPassword(token: string, newPassword: string) {
    throw new Error('Method not implemented.');
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.userService.createFromRegistration(
      {
      ...registerDto,
      password: hashedPassword,
      },
      false, // isVerified
      'user' // role
    );
  }

  // Add other auth methods like verifyEmail, forgotPassword, etc.
}