import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNotEmpty, IsNumber, IsArray, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SortOrder, PostType } from '../../../common/enums/index';

/**DTO for filtering and sorting post feed*/
export class ListFilterDto {
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
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string' && !value.includes(',')) return [Number(value)];
    if (typeof value === 'string') return value.split(',').map((v) => Number(v.trim()));
    if (Array.isArray(value)) return value.map(Number);
    return [];
  })
  subCategoryIds?: number[];

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

  /** Optional search keyword */
  @IsOptional()
  @IsString()
  keyword: string;
}
