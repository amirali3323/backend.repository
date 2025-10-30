import { HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { AuthService } from '../auth/auth.service';
import { AppException } from 'src/common/exceptions/AppException';
import { StatusPost } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly authService: AuthService,
  ) { }

  // async createPost(createPostDto: CreatePostDto, userId: number) {
  //   const { title, description, type, mainImage, extraImages, subCategoryName, districtNames } = createPostDto;
  //   const exsistUser = await this.authService.findByPk(userId);
  //   if (!exsistUser) throw new AppException('User not found', HttpStatus.NOT_FOUND);

  //   const subCategory = await this.postRepository.findSubCategoryByName(subCategoryName);
  //   if(!subCategory) throw new AppException('SubCategory not found', HttpStatus.NOT_FOUND);

  //   return await this.postRepository.create({
  //     title, description, type, mainImage, extraImages, subCategory, userId, districts
  //   })
  // }
}
