import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User | null>) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  // Method specifically for registration
  async createFromRegistration(userData: CreateUserDto, isVerified: boolean, role: string): Promise<User | null> {
    const createdUser = new this.userModel({
      ...userData,
      isVerified,
      role,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  // Implement the verifyUser method
  async verifyUser(token: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ verificationToken: token });
    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    user.isVerified = true;
    user.verificationToken = '';
    await user.save();

    return { message: 'Email verified successfully' };
  }

  // Implement the resetPassword method
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    
    if (!user) {
      throw new NotFoundException('Invalid or expired password reset token');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    user.resetPasswordToken = '';
    user.resetPasswordExpires = new Date(0); // Set to epoch time instead of null
    await user.save();

    return { message: 'Password reset successful' };
  }
}
