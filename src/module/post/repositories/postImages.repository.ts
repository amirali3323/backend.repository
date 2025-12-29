import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostImage } from '../entities/postImage.entity';

/** Repository for managing post images */
@Injectable()
export class PostImageRepository {
  constructor(
    @InjectModel(PostImage)
    private postImageModel: typeof PostImage,
  ) {}

  /** Create a new image record linked to a post */
  async create(imageUrl: string, postId: number) {
    return await this.postImageModel.create({ imageUrl, postId });
  }

  async findAllByPostId(postId: number): Promise<PostImage[]> {
    return await this.postImageModel.findAll({ where: { postId } });
  }

  async deleteByPostId(postId: number) {
    return await this.postImageModel.destroy({ where: { postId } });
  }
}
