import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/schema/user.schema';
import { MailService } from './mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        return { message: 'Invalid email or password', error: true, status: 401 };
      }

      if (!user.isVerified) {
        return { message: 'Email not verified please make sure you are using a valied email.', error: true, status: 401 };
      }

      const payload = {
        username: user.username,
        email: user.email,
        sub: user._id,
        role: user.role
      };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: true,
        message: error.message,
        status: 500
      };
    }
  }


  async register(registerDto: RegisterDto): Promise<User | null | any> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const verificationToken = randomBytes(32).toString('hex');
    const email = registerDto.email
    const verifyEmail = await this.userService.findByEmail(email);
    if (verifyEmail) {
      return {
        message: 'user already exits please try using another email.'
      }
    }


    const user = await this.userService.createFromRegistration(
      {
        ...registerDto,
        password: hashedPassword,
        verificationToken,
      },
      false, // isVerified
      'user' // role
    );

    // Send verification email
    await this.mailService.sendVerificationEmail(user.email, verificationToken);

    return user;
  }

  async verifyEmail(token: string) {
    try {
      const user = await this.userService.findByVerificationToken(token);
      if (!user) {
        throw new BadRequestException('Invalid verification token');
      }

      if (user.isVerified) {
        throw new BadRequestException('Email already verified');
      }

      user.isVerified = true;
      user.verificationToken = token;
      await user.save();

      return { message: 'Email successfully verified' };
    } catch (error) {
      return {
        success: false,
        error: true,
        message: error.message,
        status: 500
      }
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // For security, don't reveal if user doesn't exist
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.isVerified = false;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'Password reset link sent to email', isVerified: user.isVerified, token: resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userService.findByResetToken(token);

    // Add proper null checks
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isVerified = true;
    user.resetPasswordToken = '';
    user.resetPasswordExpires = null;
    await user.save();

    return { message: 'Password successfully reset' };
  }
}