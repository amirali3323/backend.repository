import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
  Query,
  UploadedFile,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreatePostDto } from './dto/createPost.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createMulterConfig } from 'src/common/config/multer.config';
import { OptionalGuard } from 'src/common/guards/optional.guard';
import { ListFilterDto } from './dto/feedPostFilter.dto';
import { CreatepwnerClaimDto } from './dto/createOwnerClaim.dto';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import type { Response } from 'express';
import { NotFoundException } from 'src/common/exceptions';
import { ErrorCode } from 'src/common/enums';
import { AuthService } from '../auth/auth.service';

@Controller('api/post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly authService: AuthService,
  ) {}

  /** Seed database with fake posts (for testing) */
  @Get('seedFakePosts')
  async seedFakePosts() {
    return await this.postService.seedFakePosts();
  }

  /** Seed database with default categories and subcategories */
  @Get('seed-categories')
  async seedCategories() {
    return await this.postService.seedCategoriesAndSubCategories();
  }

  /** Get post feed with optional filters (category, district, type, sort, etc.) */
  @UseGuards(OptionalGuard)
  @Get('list')
  async getList(@Query() query: ListFilterDto) {
    return await this.postService.getList(query);
  }

  /** Create a new post with uploaded images (User only) */
  @Post('createPost')
  @UseGuards(RoleGuard)
  @Roles('user')
  @UseInterceptors(FilesInterceptor('images', 5, createMulterConfig('./uploads/postImages')))
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req: any,
  ) {
    const imageNames = images?.map((img) => img.filename) || [];
    createPostDto.mainImage = imageNames[0];
    createPostDto.extraImages = imageNames.slice(1);
    return await this.postService.createPost(createPostDto, req.user.id);
  }

  /** Get detailed post info by ID (accessible to all, including guests) */
  @UseGuards(OptionalGuard)
  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) postId: number, @Req() req: any) {
    const post = await this.postService.getPost(postId, req.user?.id);
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      type: post.type,
      status: post.status,
      mainImage: post.mainImage,
      extraImage: post.images?.map((d) => ({
        image: d.imageUrl,
      })),
      category: post.subCategory.category.categoryName,
      subCategory: post.subCategory.subCategoryName,
      districts:
        post.districts?.map((d) => ({
          districtName: d.districtName,
          provinceName: d.province?.provinceName,
        })) || [],
      rewardAmount: post.rewardAmount,
    };
  }

  @Post(':postId/owner-claims')
  @UseGuards(RoleGuard)
  @Roles('user')
  @UseInterceptors(FileInterceptor('claimImage', createMulterConfig('./uploads/claimImages')))
  async createClaim(
    @Body() body: CreatepwnerClaimDto,
    @UploadedFile() claimImage: Express.Multer.File,
    @Param('postId') postId: number,
    @Req() req: any,
  ) {
    body.claimImage = claimImage.filename;
    return await this.postService.createOwnerClaim(body, req.user.id, postId);
  }

  @Get('image/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = await this.postService.getPostImagePath(filename);
    return res.sendFile(filePath);
  }

  @Get('phoneNumber/:postId')
  @UseGuards(RoleGuard)
  @Roles('user')
  async getPhoneNumber(@Param('postId') postId: number) {
    const post = await this.postService.getPost(postId);
    if(!post || post.hidePhoneNumber) throw new NotFoundException('Post not found', ErrorCode.POST_NOT_FOUND);
    const phoneNumber = await this.authService.getPhoneNumber(post.userId);
    return {phoneNumber};
  }
}
