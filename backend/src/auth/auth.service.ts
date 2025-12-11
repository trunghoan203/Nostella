import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: AuthDto) {
    const existingUser: User | null = await this.usersService.findOneByEmail(
      dto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.usersService.createUser({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.name || 'Người dùng mới',
      verificationCode,
      codeExpiresAt,
      isVerified: false,
    });

    try {
      await this.emailService.sendVerificationCode(dto.email, verificationCode);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }

    return {
      message:
        'Registration successful. Please check your email for verification code.',
      email: dto.email,
    };
  }

  async verifyOtp(email: string, code: string) {
    const user: User | null = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (user.isVerified) throw new BadRequestException('User already verified');

    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (user.codeExpiresAt && user.codeExpiresAt < new Date()) {
      throw new BadRequestException('Verification code expired');
    }

    const updated: User = await this.usersService.updateUser(user.id, {
      isVerified: true,
      verificationCode: null,
      codeExpiresAt: null,
    });

    const verifiedUser: User = await this.usersService.findById(updated.id);

    const payload = { sub: verifiedUser.id, email: verifiedUser.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: verifiedUser.id,
        email: verifiedUser.email,
        name: verifiedUser.fullName ?? null,
        isVip: Boolean(verifiedUser.isVip),
      },
    };
  }

  async resendOtp(email: string) {
    const user: User | null = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (user.isVerified) throw new BadRequestException('User already verified');

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.usersService.updateUser(user.id, {
      verificationCode,
      codeExpiresAt,
    });

    try {
      await this.emailService.sendVerificationCode(email, verificationCode);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }

    return { message: 'Verification code resent' };
  }

  async login(dto: AuthDto) {
    const user: User | null = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Sai email hoặc mật khẩu');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Sai email hoặc mật khẩu');
    }

    if (!user.isVerified)
      throw new ForbiddenException('Please verify your email first');

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        isVip: Boolean(user.isVip),
      },
    };
  }
}
