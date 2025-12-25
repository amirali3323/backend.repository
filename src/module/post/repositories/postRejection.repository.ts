import { PostRejection } from '../entities/postRejection.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PostRejectionRepository {
  constructor(
    @InjectModel(PostRejection)
    private postRejectionModel: typeof PostRejection,
  ) {}

  async create(data: {reason: string, postId: number}) {
    return await this.postRejectionModel.create(data);
  }
}
