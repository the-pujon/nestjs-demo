import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET: string =
    process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN: string | number =
    process.env.JWT_EXPIRES_IN || '7d';

  constructor(private prisma: PrismaService) {}

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const { username, displayName, email, password } = signupDto;

    // Check if user already exists
    const existingUser = await this.prisma.client.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.prisma.client.user.create({
      data: {
        username,
        displayName,
        email,
        passwordHash,
      },
    });

    // Generate JWT token
    const accessToken = this.generateToken(user.id, user.username);

    return {
      accessToken,
      user: {
        id: user.id.toString(),
        username: user.username,
        displayName: user.displayName,
        email: user.email ?? undefined,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { username, password } = loginDto;

    // Find user
    const user = await this.prisma.client.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if password exists
    if (!user.passwordHash) {
      throw new BadRequestException('User has no password set');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const accessToken = this.generateToken(user.id, user.username);

    return {
      accessToken,
      user: {
        id: user.id.toString(),
        username: user.username,
        displayName: user.displayName,
        email: user.email ?? undefined,
      },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = jwt.verify(token, this.JWT_SECRET);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private generateToken(userId: bigint, username: string): string {
    const payload = {
      sub: userId.toString(),
      username,
    };

    return jwt.sign(
      payload,
      this.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions,
    );
  }
}
