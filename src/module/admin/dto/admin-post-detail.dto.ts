import { Expose, Transform } from 'class-transformer';

export class AdminPostDetailDto {
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
  @Transform(({ obj }) => obj.images?.map((img) => img.imageUrl) ?? [])
  images: string[];

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
