import { HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { AuthService } from '../auth/auth.service';
import { AppException } from 'src/common/exceptions/AppException';
import { StatusPost } from './entities/post.entity';
import { LocationService } from '../location/location.service';
import { PostImageRepository } from './repositories/postImages.repository';
import { PostDistricRepository } from './repositories/postDistrict.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postImageRepository: PostImageRepository,
    private readonly postDistricRepository: PostDistricRepository,
    private readonly authService: AuthService,
    private readonly locationService: LocationService,
  ) { }

  async createPost(createPostDto: CreatePostDto, userId: number) {
    const { title, description, type, mainImage, extraImages, subCategoryName, districtNames } = createPostDto;
    const exsistUser = await this.authService.findByPk(userId);
    if (!exsistUser) throw new AppException('User not found', HttpStatus.NOT_FOUND);

    const subCategory = await this.postRepository.findSubCategoryByName(subCategoryName);
    if (!subCategory) throw new AppException('SubCategory not found', HttpStatus.NOT_FOUND);

    const districtIds = await this.locationService.getAllDistrictIdsWithNames(districtNames);

    const newPost = await this.postRepository.create({ title, description, type, mainImage, subCategoryId: subCategory.id, userId })

    for (const imageUrl of extraImages) {
      await this.postImageRepository.create(imageUrl, newPost.id);
    }

    for (const districtId of districtIds) {
      await this.postDistricRepository.create(newPost.id, districtId)
    }
    return { message: 'Created post successfully' }
  }
}
