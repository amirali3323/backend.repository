import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Post(':postId/approve')
  // @UseGuards(RoleGuard)
  // @Roles('admin')
  // async approvePost(@Param('postId') postId: number) {

  // }
}
