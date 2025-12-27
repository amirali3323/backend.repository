import { Injectable } from '@nestjs/common';
import { PostDeletionLogs } from '../entities/postDeletionLogs.entity';
import { InjectModel } from '@nestjs/sequelize';
import { DeletionReason } from 'src/common/enums/deletion-reason.enum';

export class PostDeletionLogsRepository {
  constructor(
    @InjectModel(PostDeletionLogs)
    private postDeletionLogsModel: typeof PostDeletionLogs,
  ) {}

  async create(data: { postId: number; reason: DeletionReason }) {
    return await this.postDeletionLogsModel.create(data);
  }
}
