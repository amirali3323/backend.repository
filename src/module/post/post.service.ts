import { HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { AuthService } from '../auth/auth.service';
import { AppException } from 'src/common/exceptions/AppException';
import { BooleanString, StatusPost } from './entities/post.entity';
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
    const { title, description, type, mainImage, extraImages, category, locationInputs, hidePhoneNumber, isWillingToChat } = createPostDto;

    const exsistUser = await this.authService.findByPk(userId);
    if (!exsistUser) throw new AppException('User not found', HttpStatus.NOT_FOUND);

    const [categoryName, subCategoryName] = category.split('-');

    const subCategory = await this.postRepository.findSubCategoryByName(categoryName, subCategoryName);
    if (!subCategory) throw new AppException('SubCategory not found', HttpStatus.NOT_FOUND);

    const districtIds = await this.locationService.getAllDistrictIdsWithNames(locationInputs);
    if (!districtIds.length) throw new AppException('location not found', HttpStatus.NOT_FOUND);

    const newPost = await this.postRepository.create({ title, description, type, mainImage, subCategoryId: subCategory.id, userId, hidePhoneNumber, isWillingToChat })

    for (const imageUrl of extraImages) {
      await this.postImageRepository.create(imageUrl, newPost.id);
    }

    for (const districtId of districtIds) {
      await this.postDistricRepository.create(newPost.id, districtId)
    }
    return { message: 'Created post successfully' }
  }

  async getPost(id: number, userId?: number) {
    const post = await this.postRepository.getPost(id);
    if (!post) throw new AppException('Post not found', HttpStatus.NOT_FOUND);

    if (post.status === StatusPost.PENDING || post.status === StatusPost.REJECTED) {
      console.log('here')
      if (userId !== post.userId) {
        console.log(userId);
        console.log(post.userId)
        throw new AppException('Post not found', HttpStatus.NOT_FOUND);
      }
    }
    const plain = post.get({ plain: true })
    return {
      id: plain.id,
      title: plain.title,
      description: plain.description,
      type: plain.type,
      status: plain.status,
      mainImage: plain.mainImage,
      extraImage: plain.images?.map(d => ({
        image: d.imageUrl,
      })),
      category: plain.subCategory.category.categoryName,
      subCategory: plain.subCategory.subCategoryName,
      hidePhoneNumber: plain.hidePhoneNumber,
      isWillingToChat: plain.isWillingToChat,
      districts: plain.districts?.map(d => ({
        districtName: d.districtName,
        provinceName: d.province?.provinceName,
      })) || [],
    }
  }
}
