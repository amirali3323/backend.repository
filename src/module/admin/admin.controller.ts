import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PostService } from '../post/post.service';
import { AuthService } from '../auth/auth.service';
import type { PostStats } from '../post/interfaces/postStats.interface';
import { PostStatus } from 'src/common/enums';
import { UpdateStatusDto } from './dto/updateStatus.dto';

@Controller('api/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly postService: PostService,
    private readonly authService: AuthService,
  ) {}

  @Get('dashboard-stats')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async getDashboardStats() {
    const postStatusCounts = await this.postService.getPostStatusCount();
    const postProvinceCounts = await this.postService.getPostprovinceCount();
    const postTypePercent = await this.postService.getPostTypePercent();
    const userCount = await this.authService.getUserCounts();
    return {
      postStatusCounts,
      postProvinceCounts,
      postTypePercent,
      userCount,
    };
  }

  @Get('posts')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async getPostByStatus(@Query('offset') offset: string, @Query('status') status?: PostStatus) {
    const numericOffset = parseInt(offset) || 0;
    return await this.postService.getPostByStatus(numericOffset, status);
  }

  @Get('getPost/:postId')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async getPost(@Param('postId') postId: number) {
    return await this.postService.getPostForAdmin(postId);
  }

  @Put('posts/:postId/status')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async updateStatus(@Param('postId') postId: number, @Body() body: UpdateStatusDto) {
    return await this.postService.updateStatus(postId, body)
  }

  @Get('users')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async getUser(@Query('offset') offset: number) {
    return await this.authService.getUsers(offset);
  }
}
