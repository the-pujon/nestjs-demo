import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [AuthModule, BlogModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
