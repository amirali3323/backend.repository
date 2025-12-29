import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostDistrict } from '../entities/postDistrict.entity';

/** Repository for managing Post–District relationships */
@Injectable()
export class PostDistricRepository {
  constructor(
    @InjectModel(PostDistrict)
    private postDistricModel: typeof PostDistrict,
  ) {}

  /** Create a new link between a post and a district */
  async create(postId: number, districtId: number) {
    return await this.postDistricModel.create({ postId, districtId });
  }

  async deleteByPostId(postId: number) {
    return await this.postDistricModel.destroy({ where: { postId } });
  }
}
