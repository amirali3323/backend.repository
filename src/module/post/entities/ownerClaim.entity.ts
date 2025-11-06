import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Post } from '../../post/entities/post.entity';
import { User } from 'src/module/auth/entities/user.entity';

export enum OwnerClaimStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Table({ tableName: 'ownerClaim' })
export class OwnerClaim extends Model<
  OwnerClaim,
  {
    claimantId: number;
    postId: number;
    message: string;
    claimImage: string;
  }
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message: string;

  @Column({
    type: DataType.ENUM(...Object.values(OwnerClaimStatus)),
    allowNull: false,
    defaultValue: OwnerClaimStatus.PENDING
  })
  status: OwnerClaimStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  claimImage: string;

  @BelongsTo(() => Post)
  post: Post;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  postId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  claimantId: number;
}
