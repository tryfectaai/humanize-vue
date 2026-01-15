import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from './dto';

interface JwtPayload {
  sub: number;
  email: string;
  accountType: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password (using password1 from the DTO)
    const hashedPassword = await bcrypt.hash(dto.password1, 12);

    // Create user (using account_type from the DTO)
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        accountType: dto.account_type,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.accountType);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        accountType: user.accountType,
      },
    };
  }

  async login(dto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.accountType);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        accountType: user.accountType,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(dto.refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const access = await this.generateAccessToken(user.id, user.email, user.accountType);

      return { access };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists or not
      return { message: 'If an account exists with this email, you will receive a password reset link' };
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password_reset' },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1h',
      },
    );

    // TODO: Send email with reset link
    // For now, just return the token (in production, this would be sent via email)
    console.log(`Password reset token for ${user.email}: ${resetToken}`);

    return { message: 'If an account exists with this email, you will receive a password reset link' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: number; type: string }>(dto.token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (payload.type !== 'password_reset') {
        throw new BadRequestException('Invalid reset token');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 12);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { password: hashedPassword },
      });

      return { message: 'Password reset successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const passwordValid = await bcrypt.compare(dto.currentPassword, user.password);

    if (!passwordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        accountType: true,
        dateJoined: true,
        lastLogin: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }

  private async generateTokens(userId: number, email: string, accountType: string) {
    const [access, refresh] = await Promise.all([
      this.generateAccessToken(userId, email, accountType),
      this.generateRefreshToken(userId, email, accountType),
    ]);

    // Return 'access' and 'refresh' to match frontend expectations
    return { access, refresh };
  }

  private async generateAccessToken(userId: number, email: string, accountType: string): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      accountType,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1d',
    });
  }

  private async generateRefreshToken(userId: number, email: string, accountType: string): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      accountType,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
    });
  }
}
