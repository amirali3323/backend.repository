import { Expose, Transform } from 'class-transformer';
import { PostStatus, PostType } from 'src/common/enums';

export class PostsOutputDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  status: PostStatus;

  @Expose()
  type: PostType;

  @Expose()
  createdAt: string;

  @Expose()
  mainImage: string;

  @Expose()
  @Transform(({ obj }) => obj.districts?.[0]?.districtName ?? null)
  districtName: string | null;
}
