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
  Delete,
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
import type { Response } from 'express';
import { NotFoundException } from 'src/common/exceptions';
import { ErrorCode } from 'src/common/enums';
import { AuthService } from '../auth/auth.service';
import { DeletionReason } from 'src/common/enums/deletion-reason.enum';
import { DeletePostDto } from './dto/deletePost.dto';

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
  @Get('list')
  async getList(@Query() query: ListFilterDto) {
    return await this.postService.getList(query);
  }

  @Get('me/:postId')
  @UseGuards(RoleGuard)
  @Roles('user', 'admin')
  async getMyPost(@Param('postId') postId: number, @Req() req: any) {
    return await this.postService.getMyPost(postId, req.user.id);
  }

  @Get('me')
  @UseGuards(RoleGuard)
  @Roles('user', 'admin')
  async getMyPosts(@Req() req: any) {
    return await this.postService.getMyPosts(req.user.id);
  }

  /** Create a new post with uploaded images (User only) */
  @Post('createPost')
  @UseGuards(RoleGuard)
  @Roles('user', 'admin')
  @UseInterceptors(FilesInterceptor('images', 10, createMulterConfig('./uploads/postImages')))
  async createPost(@Body() body: CreatePostDto, @UploadedFiles() images: Express.Multer.File[], @Req() req: any) {
    const imageNames = images?.map((img) => img.filename) || [];
    body.mainImage = imageNames[body.featuredImageIndex];
    const extraImages = [...imageNames];
    extraImages.splice(body.featuredImageIndex, 1);
    body.extraImages = extraImages;
    return await this.postService.createPost(body, req.user.id);
  }

  @Post(':postId/delete')
  @UseGuards(RoleGuard)
  @Roles('user', 'admin')
  async deletePost(@Req() req: any, @Param('postId') postId: number, @Body() body: DeletePostDto) {
    return await this.postService.deletePost(postId, req.user.id, body);
  }

  // @Get('recommended')
  // @UseGuards(RoleGuard)
  // @Roles('user', 'admin')
  // async getRecommended(@Req() req: any) {
  //   console.log('in controller')
  //   return await this.postService.getRecommendedPosts(req?.user.id);
  // }

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
        src: d.imageUrl,
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

  /** Upload an image for a post claim (User only) */
  @Post(':postId/owner-claims')
  @UseGuards(RoleGuard)
  @Roles('user', 'admin')
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

  /** Serve a post image by filename */
  @Get('image/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = await this.postService.getPostImagePath(filename);
    return res.sendFile(filePath);
  }

  /** Get the phone number of the post owner (User only) */
  @Get('phoneNumber/:postId')
  @UseGuards(RoleGuard)
  @Roles('user', 'admin')
  async getPhoneNumber(@Param('postId') postId: number) {
    const post = await this.postService.getPost(postId);
    if (!post) throw new NotFoundException('Post not found', ErrorCode.POST_NOT_FOUND);
    if (post.hidePhoneNumber) return null;
    const phoneNumber = await this.authService.getPhoneNumber(post.userId);
    return { phoneNumber };
  }
}
