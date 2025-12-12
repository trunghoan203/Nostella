import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    const mailHost = process.env.MAIL_HOST || 'smtp.gmail.com';
    const mailPort = parseInt(process.env.MAIL_PORT || '587');
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;
    const isSecure = process.env.MAIL_SECURE === 'true';

    console.log(
      `[EmailService] Config: Host=${mailHost}, Port=${mailPort}, Secure=${isSecure}, User=${mailUser}`,
    );

    this.transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: isSecure,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
      debug: true,
      logger: true,
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
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Welcome to Nostella - Verify your email',
        html,
      });
      return info;
    } catch (error) {
      console.error('[EmailService] Error sending email:', error);
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }
}
