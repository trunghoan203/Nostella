import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    const mailHost = process.env.MAIL_HOST || 'smtp.gmail.com';
    const mailPort = Number(process.env.MAIL_PORT || 465);
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;
    const mailFrom = process.env.MAIL_FROM;
    const isSecure = process.env.MAIL_SECURE === 'true';

    if (!mailUser || !mailPass || !mailFrom) {
      throw new Error('Missing MAIL_USER, MAIL_PASS or MAIL_FROM');
    }

    console.log('[EmailService] SMTP config:', {
      mailHost,
      mailPort,
      isSecure,
      mailUser,
    });

    this.transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: isSecure,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });
  }

  async sendVerificationCode(email: string, code: string) {
    try {
      return await this.transporter.sendMail({
        from: `"Nostella" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Welcome to Nostella - Verify your email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto">
            <h2>Welcome to Nostella</h2>
            <p>Your verification code:</p>
            <h1 style="letter-spacing: 6px">${code}</h1>
            <p>This code expires in 15 minutes.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('[EmailService] sendMail error:', error);
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }
}
