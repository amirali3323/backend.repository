import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { AuthService } from '../auth/auth.service';
import { NotFoundException } from 'src/common/exceptions';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { PostStatus, SortOrder } from 'src/common/enums';
import { LocationService } from '../location/location.service';
import { PostImageRepository } from './repositories/postImages.repository';
import { PostDistricRepository } from './repositories/postDistrict.repository';
import { FeedFilterDto } from './dto/feedPostFilter.dto';
import { District } from '../location/entities/district.entity';
import { Op } from 'sequelize';
import { CreatepwnerClaimDto } from './dto/createOwnerClaim.dto';
import { OwnerClaimRepositoy } from './repositories/ownerClaim.repository';
import path from 'path';
import * as fs from 'fs';
@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postImageRepository: PostImageRepository,
    private readonly postDistricRepository: PostDistricRepository,
    private readonly ownerClaimRepository: OwnerClaimRepositoy,
    private readonly authService: AuthService,
    private readonly locationService: LocationService,
  ) {}

  /** Seed database with default categories and subcategories */
  async seedCategoriesAndSubCategories() {
    await this.postRepository.seedCategoriesAndSubCategories();
  }

  /** Create a new post with images, category, and location mapping */
  async createPost(createPostDto: CreatePostDto, userId: number) {
    const {
      title,
      description,
      type,
      mainImage,
      extraImages,
      districtIds,
      subCategoryId,
      hidePhoneNumber,
      isWillingToChat,
      rewardAmount,
    } = createPostDto;

    const newPost = await this.postRepository.create({
      title,
      description,
      type,
      mainImage,
      subCategoryId,
      userId,
      hidePhoneNumber,
      isWillingToChat,
      rewardAmount,
    });

    // Save extra post images
    for (const imageUrl of extraImages) {
      await this.postImageRepository.create(imageUrl, newPost.id);
    }
    // Link post with districts
    for (const districtId of districtIds) {
      await this.postDistricRepository.create(newPost.id, districtId);
    }
    return { message: 'Created post successfully' };
  }

  /** Get detailed post data (visible to owner or if approved) */
  async getPost(id: number, userId?: number) {
    const post = await this.postRepository.getPost(id);
    if (!post) throw new NotFoundException('Post not found', ErrorCode.POST_NOT_FOUND);

    if (post.status !== PostStatus.APPROVED) {
      if (userId !== post.userId) {
        throw new NotFoundException('Post not found', ErrorCode.POST_NOT_FOUND);
      }
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
      districts:
        plain.districts?.map((d) => ({
          districtName: d.districtName,
          provinceName: d.province?.provinceName,
        })) || [],
    };
  }

  /** Fetch public post feed with filters and pagination */
  async getFeed(query: FeedFilterDto) {
    const { districtIds, subCategoryIds, type, sort, offset } = query;

    return await this.postRepository.findAll({
      where: {
        status: PostStatus.APPROVED,
        ...(type && { type }),
        ...(subCategoryIds && { subCategoryId: { [Op.in]: subCategoryIds } }),
      },
      include: [
        ...(districtIds?.length || districtIds
          ? [
              {
                model: District,
                as: 'districts',
                attributes: ['districtName'],
                through: { attributes: [] },
                where: { id: { [Op.in]: districtIds } },
                required: true,
              },
            ]
          : []),
      ],

      attributes: ['id', 'title', 'type', 'mainImage', 'createdAt', 'rewardAmount'],
      order: [['createdAt', sort === SortOrder.OLDEST ? 'ASC' : 'DESC']],
      limit: 40,
      offset,
    });
  }

  /** Seed fake posts for testing */
  async seedFakePosts() {
    return await this.postRepository.seedFakePosts();
  }

  async createOwnerClaim(body: CreatepwnerClaimDto, claimantId: number, postId: number) {
    const { claimImage, message } = body;

    const exsistPost = await this.postRepository.getPost(postId);
    if (!exsistPost || exsistPost.status !== PostStatus.APPROVED)
      throw new NotFoundException('Post not found', ErrorCode.POST_NOT_FOUND);

    const hasClaimed = await this.ownerClaimRepository.hasClaimed(postId, claimantId);
    if (hasClaimed)
      throw new ConflictException(
        'You have already submitted an ownership claim for this post',
        ErrorCode.OWNER_CLAIM_ALREADY_EXISTS,
      );

    await this.ownerClaimRepository.create({ claimantId, postId, message, claimImage });
    return {
      message: 'Ownership claim submitted successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  async getPostImagePath(filename: string): Promise<string> {
    const filePath = path.join(process.cwd(), 'uploads', 'postimages', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found', ErrorCode.IMAGE_NOT_FOUND);
    }
    return filePath;
  }
}
