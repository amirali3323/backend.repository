import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SortOrder, PostType } from '../../../common/enums/index';

/**
 * DTO for filtering and sorting post feed
 * Used in GET /post/get-feed endpoint
 */
export class FeedFilterDto {
  /** List of district IDs to filter by (optional) */
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string' && !value.includes(',')) return [Number(value)];
    if (typeof value === 'string') return value.split(',').map((v) => Number(v.trim()));
    if (Array.isArray(value)) return value.map(Number);
    return [];
  })
  districtIds?: number[];

  /** Filter by specific subcategory (optional) */
  @ApiPropertyOptional({ description: 'Subcategory ID', example: 5 })
  @IsOptional()
  @Type(() => Number)
  subCategoryIds?: number[];

  /** Filter by specific category (optional) */
  // @IsOptional()
  // @Type(() => Number)
  // categoryId?: number;

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
