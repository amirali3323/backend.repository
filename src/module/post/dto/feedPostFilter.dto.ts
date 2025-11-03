import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PostType } from '../entities/post.entity';

/** Sorting options for feed results */
export enum SortOrder {
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

/**
 * DTO for filtering and sorting post feed
 * Used in GET /post/get-feed endpoint
 */
export class FeedFilterDto {
  /** List of district IDs to filter by (optional) */
  @IsOptional()
  @Type(() => Number)
  districtIds?: number[];

  /** Filter by specific subcategory (optional) */
  @ApiPropertyOptional({ description: 'Subcategory ID', example: 5 })
  @IsOptional()
  @Type(() => Number)
  subCategoryId?: number;

  /** Filter by specific category (optional) */
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  /** Sort posts by newest or oldest (default: newest) */
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  /** Filter by post type (lost or found) */
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  /** Pagination offset (required) */
  @IsNotEmpty()
  @IsNumber()
  offset: number;
}
