import { Module } from '@nestjs/common';
import { MurmurController } from './murmur.controller';
import { MurmurService } from './murmur.service';
import { PrismaService } from '../common/services/prisma.service';

@Module({
  controllers: [MurmurController],
  providers: [MurmurService, PrismaService],
})
export class MurmurModule {}
