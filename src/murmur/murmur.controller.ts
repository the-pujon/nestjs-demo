import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MurmurService } from './murmur.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateMurmurDto } from './dto/create-murmur.dto';
import { UpdateMurmurDto } from './dto/update-murmur.dto';
import { MurmurResponseDto } from './dto/murmur-response.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';

@Controller('api')
export class MurmurController {
  constructor(private readonly murmurService: MurmurService) {}

  // GET /api/murmurs?page=1&limit=10 - Get timeline
  @Get('murmurs')
  @UseGuards(AuthGuard)
  async getTimeline(
    @CurrentUser() user: { id: bigint },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedResponse<MurmurResponseDto>> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.murmurService.getTimeline(user.id, pageNum, limitNum);
  }

  // GET /api/murmurs/:id - Get murmur by ID
  @Get('murmurs/:id')
  async getMurmurById(@Param('id') id: string): Promise<MurmurResponseDto> {
    return this.murmurService.getMurmurById(BigInt(id));
  }

  // POST /api/me/murmurs - Create a new murmur
  @Post('me/murmurs')
  @UseGuards(AuthGuard)
  async createMurmur(
    @CurrentUser() user: { id: bigint },
    @Body() createMurmurDto: CreateMurmurDto,
  ): Promise<MurmurResponseDto> {
    return this.murmurService.createMurmur(user.id, createMurmurDto);
  }

  // PATCH /api/me/murmurs/:id - Update own murmur
  @Patch('me/murmurs/:id')
  @UseGuards(AuthGuard)
  async updateMurmur(
    @CurrentUser() user: { id: bigint },
    @Param('id') id: string,
    @Body() updateMurmurDto: UpdateMurmurDto,
  ): Promise<MurmurResponseDto> {
    return this.murmurService.updateMurmur(
      user.id,
      BigInt(id),
      updateMurmurDto,
    );
  }

  // DELETE /api/me/murmurs/:id - Delete own murmur
  @Delete('me/murmurs/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMurmur(
    @CurrentUser() user: { id: bigint },
    @Param('id') id: string,
  ): Promise<void> {
    await this.murmurService.deleteMurmur(user.id, BigInt(id));
  }

  // POST /api/murmurs/:id/like - Like a murmur
  @Post('murmurs/:id/like')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async likeMurmur(
    @CurrentUser() user: { id: bigint },
    @Param('id') id: string,
  ): Promise<void> {
    await this.murmurService.likeMurmur(user.id, BigInt(id));
  }

  // DELETE /api/murmurs/:id/like - Unlike a murmur
  @Delete('murmurs/:id/like')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlikeMurmur(
    @CurrentUser() user: { id: bigint },
    @Param('id') id: string,
  ): Promise<void> {
    await this.murmurService.unlikeMurmur(user.id, BigInt(id));
  }
}
