import { OwnerClaim } from '../entities/ownerClaim.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

/** Repository for managing owner claims */
@Injectable()
export class OwnerClaimRepositoy {
  constructor(
    @InjectModel(OwnerClaim)
    private ownerClaimModel: typeof OwnerClaim,
  ) {}

  /** Repository for managing owner claims */
  async create(data: { claimantId: number; postId: number; message: string; claimImage: string }) {
    return await this.ownerClaimModel.create(data);
  }

  /** Repository for managing owner claims */
  async hasClaimed(postId: number, claimantId: number) {
    return await this.ownerClaimModel.findOne({ where: { postId, claimantId } });
  }
}
