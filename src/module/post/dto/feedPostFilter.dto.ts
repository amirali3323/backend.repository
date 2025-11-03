import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PostType } from '../entities/post.entity';

export enum SortOrder {
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class FeedFilterDto {
  @ApiPropertyOptional({ description: 'Province name', example: 'Fars' })
  @IsOptional()
  @IsString()
  provinceId?: string;

  @ApiPropertyOptional({ description: 'District (city) name', example: 'Shiraz' })
  @IsOptional()
  @IsString()
  districtName?: string;

  @ApiPropertyOptional({ description: 'Main category name', example: 'electronics' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Subcategory name', example: 'mobile' })
  @IsOptional()
  @IsString()
  subCategory?: string;

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

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of posts per page',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
