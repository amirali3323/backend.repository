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
    const { title, description, type, mainImage, extraImages, category, locationInputs } = createPostDto;
    const exsistUser = await this.authService.findByPk(userId);
    if (!exsistUser) throw new AppException('User not found', HttpStatus.NOT_FOUND);

    const [categoryName, subCategoryName] = category.split('-');

    const subCategory = await this.postRepository.findSubCategoryByName(categoryName, subCategoryName);
    if (!subCategory) throw new AppException('SubCategory not found', HttpStatus.NOT_FOUND);

    const districtIds = await this.locationService.getAllDistrictIdsWithNames(locationInputs);
    if(!districtIds.length) throw new AppException('location not found', HttpStatus.NOT_FOUND);
    console.log(districtIds)

    const newPost = await this.postRepository.create({ title, description, type, mainImage, subCategoryId: subCategory.id, userId })

    for (const imageUrl of extraImages) {
      await this.postImageRepository.create(imageUrl, newPost.id);
    }

    for (const districtId of districtIds) {
      await this.postDistricRepository.create(newPost.id, districtId)
    }
    return { message: 'Created post successfully' }
  }

  async getPost(id: number) {
    const post = await this.postRepository.getPost(id);
    if (!post || post.status === StatusPost.PENDING || StatusPost.REJECTED) throw new AppException('Post not found', HttpStatus.NOT_FOUND);
    return post;
  }
}
