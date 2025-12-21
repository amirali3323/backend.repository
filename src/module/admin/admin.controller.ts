import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PostService } from '../post/post.service';
import { AuthService } from '../auth/auth.service';
import { PostStatus } from 'src/common/enums';
import { UpdateStatusDto } from './dto/updateStatus.dto';
import { LocationService } from '../location/location.service';

@Controller('api/admin')
export class AdminController {
  constructor(
    private readonly postService: PostService,
    private readonly authService: AuthService,
    private readonly locationService: LocationService,
  ) {}

  /** Get dashboard stats: post counts by status/province/type and total users */
  @Get('dashboard-stats')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async getDashboardStats() {
    const postStatusCounts = await this.postService.getPostStatusCount();
    const postProvinceCounts = await this.locationService.getPostProvinceCount();
    const postTypePercent = await this.postService.getPostTypePercent();
    const userCount = await this.authService.getUserCounts();
    return {
      postStatusCounts,
      postProvinceCounts,
      postTypePercent,
      userCount,
    };
  }

  /** Get posts filtered by status/user with pagination */
  @Get('posts')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async getPostByStatus(
    @Query('offset') offset: string,
    @Query('status') status?: PostStatus,
    @Query('userId') userId?: number,
  ) {
    const numericOffset = parseInt(offset) || 0;
    return await this.postService.getPostByStatus(numericOffset, status, userId);
  }

  /** Get full post details for admin */
  @Get('getPost/:postId')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async getPost(@Param('postId') postId: number) {
    return await this.postService.getPostForAdmin(postId);
  }

  /** Update post status */
  @Put('posts/:postId/status')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async updateStatus(@Param('postId') postId: number, @Body() body: UpdateStatusDto) {
    return await this.postService.updateStatus(postId, body);
  }

  /** Get users with pagination */
  @Get('users')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async getUsers(@Query('offset') offset: number) {
    return await this.authService.getUsers(offset);
  }
}
