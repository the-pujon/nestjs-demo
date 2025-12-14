import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateMurmurDto } from './dto/create-murmur.dto';
import { UpdateMurmurDto } from './dto/update-murmur.dto';
import { MurmurResponseDto } from './dto/murmur-response.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class MurmurService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get timeline with own murmurs and murmurs from followed users
   * Supports pagination
   */
  async getTimeline(
    userId: bigint,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<MurmurResponseDto>> {
    // Get list of users that current user follows
    const following = await this.prisma.client.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    // Include own user id in the list
    const userIds = [userId, ...followingIds];

    // Calculate offset
    const skip = (page - 1) * limit;

    // Get total count
    const total = await this.prisma.client.murmur.count({
      where: {
        userId: { in: userIds },
      },
    });

    // Get murmurs
    const murmurs = await this.prisma.client.murmur.findMany({
      where: {
        userId: { in: userIds },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Transform to response DTOs
    const data = murmurs.map((murmur) => ({
      id: murmur.id.toString(),
      content: murmur.content,
      createdAt: murmur.createdAt,
      updatedAt: murmur.updatedAt,
      likeCount: murmur.likes.length,
      likedByMe: murmur.likes.some((like) => like.userId === userId),
      author: {
        id: murmur.user.id.toString(),
        username: murmur.user.username,
        displayName: murmur.user.displayName,
      },
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single murmur by ID
   */
  async getMurmurById(
    murmurId: bigint,
    userId?: bigint,
  ): Promise<MurmurResponseDto> {
    const murmur = await this.prisma.client.murmur.findUnique({
      where: { id: murmurId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!murmur) {
      throw new NotFoundException('Murmur not found');
    }

    return {
      id: murmur.id.toString(),
      content: murmur.content,
      createdAt: murmur.createdAt,
      updatedAt: murmur.updatedAt,
      likeCount: murmur.likes.length,
      likedByMe: userId
        ? murmur.likes.some((like) => like.userId === userId)
        : false,
      author: {
        id: murmur.user.id.toString(),
        username: murmur.user.username,
        displayName: murmur.user.displayName,
      },
    };
  }

  /**
   * Create a new murmur
   */
  async createMurmur(
    userId: bigint,
    createMurmurDto: CreateMurmurDto,
  ): Promise<MurmurResponseDto> {
    // Validate content length (max 280 characters)
    if (createMurmurDto.content.length > 280) {
      throw new ConflictException('Content must be 280 characters or less');
    }

    if (createMurmurDto.content.trim().length === 0) {
      throw new ConflictException('Content cannot be empty');
    }

    const murmur = await this.prisma.client.murmur.create({
      data: {
        content: createMurmurDto.content,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    return {
      id: murmur.id.toString(),
      content: murmur.content,
      createdAt: murmur.createdAt,
      updatedAt: murmur.updatedAt,
      likeCount: murmur.likes.length,
      likedByMe: false,
      author: {
        id: murmur.user.id.toString(),
        username: murmur.user.username,
        displayName: murmur.user.displayName,
      },
    };
  }

  /**
   * Update a murmur (only owner can update)
   */
  async updateMurmur(
    userId: bigint,
    murmurId: bigint,
    updateMurmurDto: UpdateMurmurDto,
  ): Promise<MurmurResponseDto> {
    // Check if murmur exists
    const murmur = await this.prisma.client.murmur.findUnique({
      where: { id: murmurId },
    });

    if (!murmur) {
      throw new NotFoundException('Murmur not found');
    }

    // Check if user is the owner
    if (murmur.userId !== userId) {
      throw new ForbiddenException('You can only edit your own murmurs');
    }

    // Validate content length
    if (updateMurmurDto.content.length > 280) {
      throw new ConflictException('Content must be 280 characters or less');
    }

    if (updateMurmurDto.content.trim().length === 0) {
      throw new ConflictException('Content cannot be empty');
    }

    // Update murmur
    const updatedMurmur = await this.prisma.client.murmur.update({
      where: { id: murmurId },
      data: {
        content: updateMurmurDto.content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    return {
      id: updatedMurmur.id.toString(),
      content: updatedMurmur.content,
      createdAt: updatedMurmur.createdAt,
      updatedAt: updatedMurmur.updatedAt,
      likeCount: updatedMurmur.likes.length,
      likedByMe: updatedMurmur.likes.some((like) => like.userId === userId),
      author: {
        id: updatedMurmur.user.id.toString(),
        username: updatedMurmur.user.username,
        displayName: updatedMurmur.user.displayName,
      },
    };
  }

  /**
   * Delete a murmur (only owner can delete)
   */
  async deleteMurmur(userId: bigint, murmurId: bigint): Promise<void> {
    // Check if murmur exists
    const murmur = await this.prisma.client.murmur.findUnique({
      where: { id: murmurId },
    });

    if (!murmur) {
      throw new NotFoundException('Murmur not found');
    }

    // Check if user is the owner
    if (murmur.userId !== userId) {
      throw new ForbiddenException('You can only delete your own murmurs');
    }

    // Delete murmur (cascade will delete associated likes)
    await this.prisma.client.murmur.delete({
      where: { id: murmurId },
    });
  }

  /**
   * Like a murmur
   */
  async likeMurmur(userId: bigint, murmurId: bigint): Promise<void> {
    // Check if murmur exists
    const murmur = await this.prisma.client.murmur.findUnique({
      where: { id: murmurId },
    });

    if (!murmur) {
      throw new NotFoundException('Murmur not found');
    }

    // Check if already liked
    const existingLike = await this.prisma.client.murmurLike.findUnique({
      where: {
        userId_murmurId: {
          userId,
          murmurId,
        },
      },
    });

    if (existingLike) {
      throw new ConflictException('You have already liked this murmur');
    }

    // Create like
    await this.prisma.client.murmurLike.create({
      data: {
        userId,
        murmurId,
      },
    });
  }

  /**
   * Unlike a murmur
   */
  async unlikeMurmur(userId: bigint, murmurId: bigint): Promise<void> {
    // Check if like exists
    const existingLike = await this.prisma.client.murmurLike.findUnique({
      where: {
        userId_murmurId: {
          userId,
          murmurId,
        },
      },
    });

    if (!existingLike) {
      throw new NotFoundException('Like not found');
    }

    // Delete like
    await this.prisma.client.murmurLike.delete({
      where: {
        userId_murmurId: {
          userId,
          murmurId,
        },
      },
    });
  }
}
