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
} from '@nestjs/common';
import { PostService } from './post.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreatePostDto } from './dto/createPost.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createMulterConfig } from 'src/common/config/multer.config';
import { OptionalGuard } from 'src/common/guards/optional.guard';
import { FeedFilterDto } from './dto/feedPostFilter.dto';
import { CreatepwnerClaimDto } from './dto/createOwnerClaim.dto';

@Controller('api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

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
  @Get('get-feed')
  async getFeed(@Query() query: FeedFilterDto) {
    return await this.postService.getFeed(query);
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
    if (typeof createPostDto.locationInputs === 'string') {
      createPostDto.locationInputs = JSON.parse(createPostDto.locationInputs);
    }
    const imageNames = images?.map((img) => img.filename) || [];
    createPostDto.mainImage = imageNames[0];
    createPostDto.extraImages = imageNames.slice(1);
    return await this.postService.createPost(createPostDto, req.user.id);
  }

  /** Get detailed post info by ID (accessible to all, including guests) */
  @UseGuards(OptionalGuard)
  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) postId: number, @Req() req?: any) {
    return await this.postService.getPost(postId, req.user?.id);
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
}
