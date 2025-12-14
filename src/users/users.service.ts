import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.prisma.client.user.findMany({
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    console.log('users', users);

    // Transform BigInt to string for JSON serialization
    return users.map((user) => ({
      id: user.id.toString(),
      username: user.username,
      displayName: user.displayName,
      email: user.email ?? undefined,
      createdAt: user.createdAt,
      followerCount: user._count.followers,
      followingCount: user._count.following,
    }));
  }

  async getCurrentUser(userId: bigint): Promise<UserResponseDto> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id.toString(),
      username: user.username,
      displayName: user.displayName,
      email: user.email ?? undefined,
      createdAt: user.createdAt,
      followerCount: user._count.followers,
      followingCount: user._count.following,
    };
  }

  async getUserByUsername(username: string): Promise<UserResponseDto> {
    const user = await this.prisma.client.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id.toString(),
      username: user.username,
      displayName: user.displayName,
      email: user.email ?? undefined,
      createdAt: user.createdAt,
      followerCount: user._count.followers,
      followingCount: user._count.following,
    };
  }

  async followUser(followerId: bigint, followingId: bigint): Promise<void> {
    // Check if user exists
    const userToFollow = await this.prisma.client.user.findUnique({
      where: { id: followingId },
    });

    if (!userToFollow) {
      throw new NotFoundException('User to follow not found');
    }

    // Check if user is trying to follow themselves
    if (followerId === followingId) {
      throw new ConflictException('Cannot follow yourself');
    }

    // Check if already following
    const existingFollow = await this.prisma.client.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      throw new ConflictException('Already following this user');
    }

    // Create follow relationship
    await this.prisma.client.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  async unfollowUser(followerId: bigint, followingId: bigint): Promise<void> {
    // Check if follow relationship exists
    const existingFollow = await this.prisma.client.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!existingFollow) {
      throw new NotFoundException('Follow relationship not found');
    }

    // Delete follow relationship
    await this.prisma.client.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }
}
