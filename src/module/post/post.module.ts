import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './entities/post.entity';
import { AuthModule } from '../auth/auth.module';
import { PostRepository } from './repositories/post.repository';
import { PostImage } from './entities/postImage.entity';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/subCategory.entity';
import { LocationModule } from '../location/location.module';
import { PostDistricRepository } from './repositories/postDistrict.repository';
import { PostImageRepository } from './repositories/postImages.repository';
import { PostDistrict } from './entities/postDistrict.entity';
import { OwnerClaimRepositoy } from './repositories/ownerClaim.repository';
import { OwnerClaim } from './entities/ownerClaim.entity';
import { PostCreatedListener } from './listeners/post-created.lintener';
import { PostNotifySimilarListener } from './listeners/post-notify-similar.listener';
import { PostRejection } from './entities/postRejection.entity';
import { PostRejectionRepository } from './repositories/postRejection.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([Post, PostImage, Category, SubCategory, PostDistrict, OwnerClaim, PostRejection]),
    AuthModule,
    LocationModule,
  ],
  exports: [PostService],
  controllers: [PostController],
  providers: [
    PostService,
    OwnerClaimRepositoy,
    PostRepository,
    PostDistricRepository,
    PostImageRepository,
    PostCreatedListener,
    PostNotifySimilarListener,
    PostRejectionRepository
  ],
})
export class PostModule {}
