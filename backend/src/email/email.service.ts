import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error('MAIL_USER and MAIL_PASS must be set in environment');
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: (process.env.MAIL_SECURE ?? 'false') === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendVerificationCode(email: string, code: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #8DA399; text-align: center;">Welcome to Nostella</h2>
        <p>Hi there,</p>
        <p>Thank you for joining Nostella. To complete your registration, please use the verification code below:</p>
        <div style="background-color: #F5F0E6; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2D2D2D;">${code}</span>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>Best regards,<br>The Nostella Team</p>
      </div>
    `;

    try {
      const info = await this.transporter.sendMail({
        from:
          process.env.MAIL_FROM ?? '"Nostella Team" <no-reply@nostella.com>',
        to: email,
        subject: 'Welcome to Nostella - Verify your email',
        html,
      });
      return info;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }
}
