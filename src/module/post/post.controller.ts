import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { PostService } from './post.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreatePostDto } from './dto/createPost.dto';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterConfig } from 'src/common/config/multer.config';

@Controller('api/post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  // @Post('createPost')
  // @UseGuards(RoleGuard)
  // @Roles('user')
  // @UseInterceptors(
  //   FileInterceptor('mainImage', createMulterConfig('./uploads/postImages')),
  //   FileInterceptor('extreImages', createMulterConfig('./uploads/postImages')),
  // )
  // async createPost(
  //   @Body() createPostDto: CreatePostDto,
  //   @UploadedFile() mainImage: Express.Multer.File,
  //   @UploadedFiles() extraImages: Express.Multer.File[],
  //   @Req() req: Request) {
  //   createPostDto.mainImage = mainImage.filename;
  //   createPostDto.extraImages = extraImages?.map((img) => img.filename) || [];

  //   return await this.postService.createPost(createPostDto, req['userId']);
  // }


}
