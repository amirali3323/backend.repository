import { Expose, Transform, Type } from 'class-transformer';
import { AdminOwnerPostDto } from './admin-post-owner.dto';

export class AdminPostDetailDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  type: string;

  @Expose()
  status: string;

  @Expose()
  mainImage: string | null;

  @Expose()
  rewardAmount: string | null;

  @Expose()
  hidePhoneNumber: boolean;

  @Expose()
  createdAt: string;

  @Expose()
  @Type(() => AdminOwnerPostDto)
  owner: AdminOwnerPostDto;

  @Expose()
  @Transform(({ obj }) => obj.images?.map((img) => ({ src: img.imageUrl })) ?? [])
  images: { src: string }[];

  @Expose()
  @Transform(
    ({ obj }) =>
      obj.districts?.map((d) => ({
        districtName: d.districtName,
        provinceName: d.province?.provinceName ?? null,
      })) ?? [],
  )
  location: { districtName: string; provinceName: string | null }[];

  @Expose()
  @Transform(({ obj }) => obj.subCategory.subCategoryName)
  subCategoryName: string;

  @Expose()
  @Transform(({ obj }) => obj.subCategory.category.categoryName)
  categoryName: string;
}
