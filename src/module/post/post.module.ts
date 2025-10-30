import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './entities/post.entity';
import { AuthModule } from '../auth/auth.module';
import { PostRepository } from './post.repository';
import { PostImage } from './entities/postImage.entity';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/subCategory.entity';

@Module({
  imports: [SequelizeModule.forFeature([Post, PostImage, Category, SubCategory]), AuthModule],
  controllers: [PostController],
  providers: [PostService, PostRepository,],
})
export class PostModule {}
