import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email',
      html: `
  <p>Click below to verify your email (you'll be automatically redirected):</p>
  <a href="${verificationUrl}" style="...">Verify Email</a>
  <p>Or copy this link: ${verificationUrl}</p>
`
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.CORS_ORIGIN}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
      <p>Click below to reset password:</p>
      <a href="${resetUrl}" style="...">Verify Email</a>
      <p>Or copy this link: ${resetUrl}</p>
    `
    });
  }
}