import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generateStory(userId: string, photoId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isVip) {
      throw new ForbiddenException(
        'Upgrade to VIP to use AI Storytelling feature.',
      );
    }
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) throw new NotFoundException('Photo not found');

    if (photo.userId !== userId) {
      throw new NotFoundException('Photo does not belong to this user');
    }

    const prompt = `
      Write a short, emotional, and nostalgic story (3–4 sentences) inspired by a photographed memory.
      Photo Title: "${photo.caption || 'A precious moment'}"
      Taken on: ${new Date(photo.createdAt).toDateString()}.
      Style: Heartwarming, poetic, nostalgic, gentle, no hashtags.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const story: string = response.text();

      await this.prisma.photo.update({
        where: { id: photoId },
        data: { story, hasAiStory: true },
      });

      return { story };
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw new InternalServerErrorException('Failed to generate story');
    }
  }
}
