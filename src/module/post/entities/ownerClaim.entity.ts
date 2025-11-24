import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Post } from '../../post/entities/post.entity';
import { User } from 'src/module/auth/entities/user.entity';
import { OwnerClaimStatus } from 'src/common/enums/ownerClaim-status.enum';

/**
 * OwnerClaim entity representing a user's claim on a post.
 */
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
  /** Claim message provided by the user */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message: string;

  /** Status of the claim (PENDING, APPROVED, REJECTED) */
  @Column({
    type: DataType.ENUM(...Object.values(OwnerClaimStatus)),
    allowNull: false,
    defaultValue: OwnerClaimStatus.PENDING,
  })
  status: OwnerClaimStatus;

  /** Optional image uploaded by the claimant */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  claimImage: string;

  /** Relation to the post being claimed */
  @BelongsTo(() => Post)
  post: Post;

  /** Foreign key referencing the post */
  @ForeignKey(() => Post)
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  postId: number;

  /** Relation to the user who made the claim */
  @BelongsTo(() => User)
  user: User;

  /** Foreign key referencing the user who claimed */
  @ForeignKey(() => User)
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  claimantId: number;
}
