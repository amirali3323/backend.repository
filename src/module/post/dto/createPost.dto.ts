import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';
import { PostType } from '../entities/post.entity';
import { Transform } from 'class-transformer';

/**
 * DTO for creating a new post
 * Includes validation and type transformation rules
 */
export class CreatePostDto {
  /** Post title (required) */
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  declare title: string;

  /** Optional text description */
  @IsString()
  @IsOptional()
  declare description?: string;

  /** Post type (e.g., lost / found) */
  @IsEnum(PostType, { message: 'Type must be valid PostType' })
  declare type: PostType;

  /** Main image URL (optional) */
  @IsOptional()
  @IsString()
  declare mainImage?: string;

  /** Additional images (optional) */
  @IsOptional()
  @IsString()
  declare extraImages: string[];

  /** List of related location inputs */
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => Number(v))
      : typeof value === 'string'
        ? value.split(',').map((v) => Number(v))
        : [],
  )
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  districtIds: number[];

  /** Subcategory name (required) */
  @IsNotEmpty({ message: 'SubCategoryId is required' })
  declare subCategoryId: number;

  /** Whether to hide user’s phone number (default: false) */
  @Transform(({ value }) => (value === 'true' || value === true || value === 1 ? true : false))
  @IsBoolean()
  @IsOptional()
  hidePhoneNumber: boolean = false;

  /** Optional reward amount for lost/found item */
  @IsOptional()
  rewardAmount: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  featuredImageIndex: number;
}
