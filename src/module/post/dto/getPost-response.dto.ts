import { Expose, Type } from 'class-transformer';

class DistrictDto {
  @Expose()
  districtName: string;

  @Expose()
  provinceName: string;
}

class ExtraImageDto {
  @Expose()
  image: string;
}

export class GetPostResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  type: string;

  @Expose()
  status: string;

  @Expose()
  mainImage?: string;

  @Expose()
  rewardAmount?: string;

  @Expose()
  @Type(() => ExtraImageDto)
  extraImages?: ExtraImageDto[];

  @Expose()
  category: string;

  @Expose()
  subCategory: string;

  @Expose()
  @Type(() => DistrictDto)
  districts?: DistrictDto[];
}
