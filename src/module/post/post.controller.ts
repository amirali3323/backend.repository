import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { PostService } from './post.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreatePostDto } from './dto/createPost.dto';
import type { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createMulterConfig } from 'src/common/config/multer.config';

@Controller('api/post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post('createPost')
  @UseGuards(RoleGuard)
  @Roles('user')
  @UseInterceptors(
    FilesInterceptor('images', 5, createMulterConfig('./uploads/postImages')),
  )
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req: any) {
    const imageNames = images?.map((img) => img.filename) || []
    createPostDto.mainImage = imageNames[0];
    createPostDto.extraImages = imageNames.slice(1);
    return await this.postService.createPost(createPostDto, req.user?.id);
  }
}
