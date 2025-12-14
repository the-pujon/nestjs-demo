import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MurmurModule } from './murmur/murmur.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, MurmurModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
