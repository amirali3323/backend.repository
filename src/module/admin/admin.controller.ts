import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PostService } from '../post/post.service';

@Controller('api/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly postService: PostService,
  ) {}

  // @Post(':postId/approve')
  // @UseGuards(RoleGuard)
  // @Roles('admin')
  // async approvePost(@Param('postId') postId: number) {
  // }

  @Get('post-stats')
  // @UseGuards(RoleGuard)
  // @Roles('admin')
  async getPostStats() {
    return await this.postService.getPostStats();
  }
}
