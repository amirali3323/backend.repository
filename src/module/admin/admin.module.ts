import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PostModule } from '../post/post.module';

@Module({
  imports: [PostModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
