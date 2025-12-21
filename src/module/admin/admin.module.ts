import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PostModule } from '../post/post.module';
import { AuthModule } from '../auth/auth.module';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [PostModule, AuthModule, LocationModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
