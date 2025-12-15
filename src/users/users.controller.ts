import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /api/users - Get all users
  @Get('users')
  async getAllUsers(): Promise<UserResponseDto[]> {
    console.log('come here');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.usersService.getAllUsers();
  }

  // GET /api/me - Get current user info
  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(
    @CurrentUser() user: { id: bigint },
  ): Promise<UserResponseDto> {
    return this.usersService.getCurrentUser(user.id);
  }

  // GET /api/users/:username - Get user by username
  @Get('users/:username')
  @UseGuards(AuthGuard)
  async getUserByUsername(
    @CurrentUser() user: { id: bigint },
    @Param('username') username: string,
  ): Promise<UserResponseDto> {
    return this.usersService.getUserByUsername(username, user.id);
  }

  // POST /api/users/:id/follow - Follow a user
  @Post('users/:id/follow')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async followUser(
    @CurrentUser() user: { id: bigint },
    @Param('id') followingId: string,
  ): Promise<void> {
    await this.usersService.followUser(user.id, BigInt(followingId));
  }

  // DELETE /api/users/:id/follow - Unfollow a user
  @Delete('users/:id/follow')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollowUser(
    @CurrentUser() user: { id: bigint },
    @Param('id') followingId: string,
  ): Promise<void> {
    await this.usersService.unfollowUser(user.id, BigInt(followingId));
  }
}
