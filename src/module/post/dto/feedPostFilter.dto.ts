import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PostType } from '../entities/post.entity';

export enum SortOrder {
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class FeedFilterDto {
  @ApiPropertyOptional({ description: 'District IDs', example: [1, 2, 3] })
  @IsOptional()
  @Type(() => Number)
  districtIds?: number[];

  @ApiPropertyOptional({ description: 'Subcategory ID', example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  subCategoryId?: number;

  @ApiPropertyOptional({ description: 'Category ID', example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Sort order of posts',
    enum: SortOrder,
    example: SortOrder.NEWEST,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  @ApiPropertyOptional({
    description: 'Type of post (lost or found)',
    enum: PostType,
    example: PostType.LOST,
  })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;
}
