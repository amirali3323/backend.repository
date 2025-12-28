import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { AuthService } from '../auth/auth.service';
import { ForbiddenException, NotFoundException } from 'src/common/exceptions';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { PostStatus, PostType } from 'src/common/enums';
import { PostImageRepository } from './repositories/postImages.repository';
import { PostDistricRepository } from './repositories/postDistrict.repository';
import { ListFilterDto } from './dto/feedPostFilter.dto';
import { CreatepwnerClaimDto } from './dto/createOwnerClaim.dto';
import { OwnerClaimRepositoy } from './repositories/ownerClaim.repository';
import path from 'path';
import * as fs from 'fs';
import { PostQueryBuilder } from './query/post.query-builder';
import { MailService } from 'src/common/services/mail.service';
import { plainToInstance } from 'class-transformer';
import { AdminPostDetailDto } from '../admin/dto/admin-post-detail.dto';
import { UpdateStatusDto } from '../admin/dto/updateStatus.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Post } from './entities/post.entity';
import { PostsOutputDto } from './dto/postsOutput.dto';
import { PostOutputDto } from './dto/postOutput.dto';
import { PostRejectionRepository } from './repositories/postRejection.repository';
import { PostDeletionLogsRepository } from './repositories/postDeletionLogs.repository';
import { DeletionReason } from 'src/common/enums/deletion-reason.enum';
import { DeletePostDto } from './dto/deletePost.dto';
@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postImageRepository: PostImageRepository,
    private readonly postDistricRepository: PostDistricRepository,
    private readonly ownerClaimRepository: OwnerClaimRepositoy,
    private readonly postRejectionRepository: PostRejectionRepository,
    private readonly postDeletionLogsRepository: PostDeletionLogsRepository,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly eventEmmiter: EventEmitter2,
  ) {}

  /** Seed database with default categories and subcategories */
  async seedCategoriesAndSubCategories() {
    await this.postRepository.seedCategoriesAndSubCategories();
  }

  /** Create a new post with images, category, and location mapping */
  async createPost(body: CreatePostDto, userId: number) {
    const {
      title,
      description,
      type,
      mainImage,
      extraImages,
      districtIds,
      subCategoryId,
      hidePhoneNumber,
      rewardAmount,
    } = body;
    const newPost = await this.postRepository.create({
      title,
      description,
      type,
      mainImage,
      subCategoryId,
      userId,
      hidePhoneNumber,
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

    this.authService.getEmail(newPost.userId).then((email) => {
      if (!email) return;
      if (newPost.type === PostType.LOST) this.mailService.sendLostPostPendingApprovalEmail(email, newPost.title);
      else this.mailService.sendFoundPostPendingApprovalEmail(email, newPost.title);
    });

    this.eventEmmiter.emit('post.created', { userId, type, title });
    return { message: 'Created post successfully' };
  }

  /** Get detailed post data (visible to owner or if approved) */
  async getPost(id: number, userId?: number) {
    const post = await this.postRepository.getPost(id);
    if (!post || post.status === PostStatus.DELETED) {
      throw new NotFoundException('Post not found', ErrorCode.POST_NOT_FOUND);
    }

    if (post.status !== PostStatus.APPROVED)
      if (userId !== post.userId) {
        throw new NotFoundException('Post not found', ErrorCode.POST_NOT_FOUND);
      }

    return post;
  }

  /** Fetch public post feed with filters and pagination */
  async getList(filters: ListFilterDto) {
    const query = PostQueryBuilder.buildFeedQuery(filters);
    return await this.postRepository.findAll(query);
  }

  /** Seed fake posts for testing */
  async seedFakePosts() {
    return await this.postRepository.seedFakePosts();
  }

  /** Create ownership claim for an approved post */
  async createOwnerClaim(body: CreatepwnerClaimDto, claimantId: number, postId: number) {
    const { claimImage, message } = body;

    const exsistPost = await this.postRepository.getPost(postId);
    if (!exsistPost || exsistPost.status === PostStatus.DELETED || exsistPost.status !== PostStatus.APPROVED)
      throw new NotFoundException('Post not found', ErrorCode.POST_NOT_FOUND);

    const hasClaimed = await this.ownerClaimRepository.hasClaimed(postId, claimantId);
    if (hasClaimed)
      throw new ConflictException(
        'You have already submitted an ownership claim for this post',
        ErrorCode.OWNER_CLAIM_ALREADY_EXISTS,
      );

    await this.ownerClaimRepository.create({ claimantId, postId, message, claimImage });

    this.authService.getEmail(exsistPost.userId).then((emailAddress) => {
      if (!emailAddress) return;
      if (exsistPost.type === PostType.LOST)
        this.mailService.sendLostPostOwnerClaimEmail(emailAddress, exsistPost.title);
      else this.mailService.sendFoundPostOwnerClaimEmail(emailAddress, exsistPost.title);
    });
    return {
      message: 'Ownership claim submitted successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  /** Get image file path or throw if not found */
  async getPostImagePath(filename: string): Promise<string> {
    const filePath = path.join(process.cwd(), 'uploads', 'postimages', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found', ErrorCode.IMAGE_NOT_FOUND);
    }
    return filePath;
  }

  /** Get owner phone number (only if post is approved) */
  async getPhoneNumber(postId) {
    const post = await this.postRepository.getPost(postId);
    if (!post || post.status === PostStatus.DELETED || post.status !== PostStatus.APPROVED)
      throw new NotFoundException('Post not found', ErrorCode.POST_NOT_FOUND);

    const phoneNumber = await this.authService.getPhoneNumber(post.userId);
    return { phoneNumber };
  }

  /** Count posts by status */
  async getPostStatusCount() {
    const postStatsBystatus = await this.postRepository.getPostStatsByStatus();
    const statusStats = postStatsBystatus.reduce((acc, item) => {
      acc[item.status] = Number(item.count);
      return acc;
    }, {});
    return {
      approved: statusStats.APPROVED || 0,
      pending: statusStats.PENDING || 0,
      resolved: statusStats.RESOLVED || 0,
      rejected: statusStats.REJECTED || 0,
    };
  }

  /** Percentage of lost/found posts */
  async getPostTypePercent() {
    const postStatsByType = await this.postRepository.getPostCountByType();
    const typeStats = postStatsByType.reduce((acc, item) => {
      acc[item.type] = Number(item.count);
      return acc;
    }, {});

    const lost = typeStats.lost;
    const found = typeStats.found;

    const total = (lost || 0) + (found || 0);
    return {
      lost: total ? Math.round((lost / total) * 100) : 0,
      found: total ? Math.round((found / total) * 100) : 0,
    };
  }

  async getPostByStatus(offset: number, status?: PostStatus, userId?: number) {
    if (status === PostStatus.DELETED) throw new NotFoundException('post not found', ErrorCode.POST_NOT_FOUND);
    const Posts = await this.postRepository.getPostsByStatus(offset, status);
    return Posts.map((post) => ({
      ...post.get({ plain: true }),
      districtName: post.districts?.[0]?.districtName || null,
      districts: undefined,
    }));
  }

  /** Get full post details for admin (no status restriction) */
  async getPostForAdmin(id: number) {
    const post = await this.postRepository.getPostWithUser(id);
    if (!post) throw new NotFoundException('Post not found', ErrorCode.POST_NOT_FOUND);

    return plainToInstance(AdminPostDetailDto, post.get({ plain: true }), {
      excludeExtraneousValues: true,
    });
  }

  /** Update post status, notify owner and similar post owners if approved */
  async updateStatus(postId: number, body: UpdateStatusDto) {
    const { message, status } = body;
    const post = await this.postRepository.getPostWithUser(postId);
    if (!post) throw new NotFoundException('post not found', ErrorCode.POST_NOT_FOUND);

    await this.postRepository.updateStatus(postId, status);
    if (message && message !== '') {
      this.postRejectionRepository.create({ reason: message, postId: post.id });
    }
    this.mailService.sendPostStatusChangedEmail(post.owner.email, post.title, post.status, message);

    if (status.toUpperCase() === PostStatus.APPROVED) {
      const districtIds = post.districts?.map((d) => d.id) || [];
      this.eventEmmiter.emit('post.notify-similar', { post, districtIds });
    }
    return 'success';
  }

  /** Find posts of opposite type in same subcategory and districts */
  async findSimilarPosts(post: Post, districtIds: number[]): Promise<Post[]> {
    if (post.type === PostType.LOST)
      return await this.postRepository.findSimilarPostById(post.id, post.subCategoryId, districtIds, PostType.FOUND);
    return await this.postRepository.findSimilarPostById(post.id, post.subCategoryId, districtIds, PostType.LOST);
  }

  async getRecommendedPosts(userId: number) {
    const lastPosts = await this.postRepository.getLastApprovedUserPosts(userId);
    const recommendedMap = new Map<number, Post>();
    for (const post of lastPosts) {
      const districtIds = post.districts?.map((d) => d.id) || [];
      const oppositeType = post.type === PostType.LOST ? PostType.LOST : PostType.FOUND;
      const similarPosts = await this.postRepository.findSimilarPostById(
        post.id,
        post.subCategoryId,
        districtIds,
        oppositeType,
      );

      for (const similar of similarPosts) {
        if (!recommendedMap.has(similar.id)) {
          recommendedMap.set(similar.id, similar);
        }
      }
    }
    return Array.from(recommendedMap.values()).slice(0, 20);
  }

  async getMyPosts(id: number) {
    const posts = await this.postRepository.getPostsWithUserId(id);
    return plainToInstance(PostsOutputDto, posts, {
      excludeExtraneousValues: true,
    });
  }

  async getMyPost(postId: number, userId: number) {
    const post = await this.postRepository.getMyPost(postId);
    if (!post) throw new NotFoundException('post not found', ErrorCode.POST_NOT_FOUND);
    if (post.userId !== userId) throw new NotFoundException('post not found', ErrorCode.POST_NOT_FOUND);
    console.log(post)
    return plainToInstance(PostOutputDto, post, {
      excludeExtraneousValues: true,
    });
  }

  async deletePost(postId: number, userId: number, body: DeletePostDto) {
    const { reason } = body;
    const post = await this.postRepository.getPost(postId);
    if (!post || post.status === PostStatus.DELETED)
      throw new NotFoundException('Post not found', ErrorCode.POST_NOT_FOUND);
    if (post.userId !== userId)
      throw new ForbiddenException('You are not allowed to delete this post', ErrorCode.POST_DELETE_FORBIDDEN);

    await this.postDeletionLogsRepository.create({ postId, reason });

    if (reason === DeletionReason.FOUND_VIA_US) {
      await this.postRepository.updateStatus(postId, PostStatus.RESOLVED);
      return 'Success! Post marked as resolved.';
    }
    await this.postRepository.delete(post.id);
    return 'Post deleted successfully';
  }
}
