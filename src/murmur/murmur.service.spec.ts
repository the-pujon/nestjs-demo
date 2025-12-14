import { Test, TestingModule } from '@nestjs/testing';
import { MurmurService } from './murmur.service';
import { PrismaService } from 'src/common/services/prisma.service';
// import { PrismaService } from '../prisma/prisma.service';

describe('MurmurService', () => {
  let service: MurmurService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MurmurService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MurmurService>(MurmurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
