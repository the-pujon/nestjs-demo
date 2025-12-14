import { Controller, Get } from '@nestjs/common';

@Controller('blog')
export class BlogController {
  @Get()
  findAll() {
    return 'This action returns all blog posts';
  }

  @Get(':id')
  findOne() {
    return 'This action returns a single blog post';
  }
}
