import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    // Khởi tạo Resend với API Key (Lấy từ biến môi trường hoặc hardcode để test tạm)
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationCode(email: string, code: string) {
    try {
      const data = await this.resend.emails.send({
        from: 'Nostella <onboarding@resend.dev>', // Dùng email mặc định của Resend để test
        to: [email], // Email người nhận
        subject: 'Welcome to Nostella - Verify your email',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2>Welcome to Nostella</h2>
            <p>Your verification code is:</p>
            <h1>${code}</h1>
            <p>This code expires in 15 minutes.</p>
          </div>
        `,
      });

      console.log('[EmailService] Email sent successfully:', data);
      return data;
    } catch (error) {
      console.error('[EmailService] Error sending email:', error);
      throw new InternalServerErrorException(
        'Could not send verification email',
      );
    }
  }
}
