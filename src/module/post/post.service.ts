import { HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { AuthService } from '../auth/auth.service';
import { AppException } from 'src/common/exceptions/AppException';
import { BooleanString, StatusPost } from './entities/post.entity';
import { LocationService } from '../location/location.service';
import { PostImageRepository } from './repositories/postImages.repository';
import { PostDistricRepository } from './repositories/postDistrict.repository';
import { FeedFilterDto, SortOrder } from './dto/feedPostFilter.dto';
import { SubCategory } from './entities/subCategory.entity';
import { Category } from './entities/category.entity';
import { District } from '../location/entities/district.entity';
import { Op } from 'sequelize';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postImageRepository: PostImageRepository,
    private readonly postDistricRepository: PostDistricRepository,
    private readonly authService: AuthService,
    private readonly locationService: LocationService,
  ) {}

  async seedCategoriesAndSubCategories() {
    await this.postRepository.seedCategoriesAndSubCategories();
  }

  async createPost(createPostDto: CreatePostDto, userId: number) {
    const {
      title,
      description,
      type,
      mainImage,
      extraImages,
      category,
      locationInputs,
      hidePhoneNumber,
      isWillingToChat,
      rewardAmount,
    } = createPostDto;

    const exsistUser = await this.authService.findByPk(userId);
    if (!exsistUser) throw new AppException('User not found', HttpStatus.NOT_FOUND);

    const [categoryName, subCategoryName] = category.split('-');

    const subCategory = await this.postRepository.findSubCategoryByName(categoryName, subCategoryName);
    if (!subCategory) throw new AppException('SubCategory not found', HttpStatus.NOT_FOUND);

    const districtIds = await this.locationService.getAllDistrictIdsWithNames(locationInputs);
    if (!districtIds.length) throw new AppException('location not found', HttpStatus.NOT_FOUND);

    const newPost = await this.postRepository.create({
      title,
      description,
      type,
      mainImage,
      subCategoryId: subCategory.id,
      userId,
      hidePhoneNumber,
      isWillingToChat,
      rewardAmount,
    });

    for (const imageUrl of extraImages) {
      await this.postImageRepository.create(imageUrl, newPost.id);
    }

    for (const districtId of districtIds) {
      await this.postDistricRepository.create(newPost.id, districtId);
    }
    return { message: 'Created post successfully' };
  }

  async getPost(id: number, userId?: number) {
    const post = await this.postRepository.getPost(id);
    if (!post) throw new AppException('Post not found', HttpStatus.NOT_FOUND);

    if (post.status === StatusPost.PENDING || post.status === StatusPost.REJECTED) {
      console.log('here');
      if (userId !== post.userId) {
        throw new AppException('Post not found', HttpStatus.NOT_FOUND);
      }
    }
    let phoneNumber: string | null = null;
    if (!post.hidePhoneNumber) {
      phoneNumber = await this.authService.getPhoneNumber(post.userId);
    }
    const plain = post.get({ plain: true });
    return {
      id: plain.id,
      title: plain.title,
      description: plain.description,
      type: plain.type,
      status: plain.status,
      mainImage: plain.mainImage,
      extraImage: plain.images?.map((d) => ({
        image: d.imageUrl,
      })),
      category: plain.subCategory.category.categoryName,
      subCategory: plain.subCategory.subCategoryName,
      phoneNumber,
      isWillingToChat: plain.isWillingToChat,
      districts:
        plain.districts?.map((d) => ({
          districtName: d.districtName,
          provinceName: d.province?.provinceName,
        })) || [],
    };
  }

  async getFeed(query: FeedFilterDto) {
    const { districtIds, subCategoryId, categoryId, type, sort } = query;
    return await this.postRepository.findAll({
      where: { status: StatusPost.APPROVED, ...(type && { type }) },
      include: [
        {
          model: SubCategory,
          required: true,
          attributes: [],
          ...(subCategoryId && { where: { id: subCategoryId } }),
          include: [
            {
              model: Category,
              required: true,
              attributes: [],
              ...(categoryId && { where: { id: categoryId } }),
            },
          ],
        },
        ...(districtIds?.length
          ? [
              {
                model: District,
                attributes: ['districtName'],
                through: { attributes: [] },
                where: { id: { [Op.in]: districtIds } },
                required: true,
              },
            ]
          : []),
      ],
      attributes: ['id', 'title', 'type', 'mainImage', 'createdAt'],
      order: [['createdAt', sort === SortOrder.OLDEST ? 'ASC' : 'DESC']],
    });
  }

  async seedFakePosts() {
    return await this.postRepository.seedFakePosts();
  }
}
