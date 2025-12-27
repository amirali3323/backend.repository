import { Expose, Transform } from 'class-transformer';
import { PostStatus, PostType } from 'src/common/enums';
import { locationOutPutDto } from './locationOutPut.dto';

export class PostOutputDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  type: PostType;

  @Expose()
  status: PostStatus;

  @Expose()
  mainImage: string;

  @Expose()
  rewardAmount: string;

  @Expose()
  hidePhoneNumber: boolean;

  @Expose()
  createdAt: string;

  @Expose()
  @Transform(({ obj }) =>
    obj.districts.map((d) => ({
      districtName: d.districtName,
      provinceName: d.province.provinceName,
    })),
  )
  location: locationOutPutDto[];

  @Expose()
  @Transform(({ obj }) => obj.subCategory?.subCategoryName ?? null)
  subCagerotyName: string;

  @Expose()
  @Transform(({ obj }) => obj.subCategory.category.categoryName ?? null)
  categoryName: string;

  @Expose()
  @Transform(({ obj }) => obj.images?.map((img) => ({ src: img.imageUrl })) ?? [])
  images: { src: string }[];

  @Expose()
  @Transform(({ obj }) => (obj.status === PostStatus.REJECTED ? obj.postRejections?.[0]?.reason : null))
  rejectionReason: string;
}
