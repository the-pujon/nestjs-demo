import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

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

  @Post()
  create() {
    return 'This action creates a new blog post';
  }

  @Put(':id')
  update() {
    return 'This action updates a blog post';
  }

  @Delete(':id')
  remove() {
    return 'This action removes a blog post';
  }
}
