import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { User } from 'src/module/auth/entities/user.entity';
import { District } from 'src/module/location/entities/district.entity';
import { PostDistrict } from './postDistrict.entity';
import { PostImage } from './postImage.entity';
import { SubCategory } from './subCategory.entity';
import { OwnerClaim } from './ownerClaim.entity';
export enum PostType {
  LOST = 'lost',
  FOUND = 'found',
}

export enum StatusPost {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RESOLVED = 'RESOLVED',
}

export enum BooleanString {
  TRUE = 'true',
  FALSE = 'false',
}
@Table({ tableName: 'Posts' })
export class Post extends Model<
  Post,
  {
    title: string;
    description?: string;
    type: PostType;
    mainImage?: string;
    userId: number;
    subCategoryId: number;
    hidePhoneNumber: boolean;
    isWillingToChat: boolean;
    rewardAmount: number;
    status?: StatusPost;
  }
> {
  /** Title of the post */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  /** Detailed description of the post */
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  /** Indicates whether the post is about a lost or found item */
  @Column({
    type: DataType.ENUM(...Object.values(PostType)),
    allowNull: false,
  })
  declare type: PostType;

  /** Current status of the post (Pending, Approved, etc.) */
  @Column({
    type: DataType.ENUM(...Object.values(StatusPost)),
    allowNull: false,
    defaultValue: StatusPost.PENDING,
  })
  declare status: StatusPost;

  /** Main image of the post */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare mainImage: string;

  /** Optional reward amount for finding the item */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare rewardAmount: number | null;

  /** Related images of the post */
  @HasMany(() => PostImage)
  declare images: PostImage[];

  /** Indicates if the user's phone number should be hidden */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare hidePhoneNumber: boolean;

  /** The user who created the post */
  @BelongsTo(() => User)
  declare user: User;

  /** Foreign key for the user who owns the post */
  @ForeignKey(() => User)
  @Column
  declare userId: number;

  /** Districts related to this post */
  @BelongsToMany(() => District, () => PostDistrict)
  declare districts: District[];

  /** The subcategory this post belongs to */
  @BelongsTo(() => SubCategory)
  declare subCategory: SubCategory;

  /** Foreign key for the subcategory */
  @ForeignKey(() => SubCategory)
  @Column
  declare subCategoryId: number;

  @BelongsToMany(()=> User, ()=> OwnerClaim)
  declare claiments: User[];
}
