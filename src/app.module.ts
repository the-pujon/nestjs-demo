import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MurmurModule } from './murmur/murmur.module';

@Module({
  imports: [AuthModule, MurmurModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
