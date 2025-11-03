import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Post } from 'src/module/post/entities/post.entity';
import { District } from 'src/module/location/entities/district.entity';

@Table({ tableName: 'PostDistricts' })
export class PostDistrict extends Model<
  PostDistrict,
  {
    postId: number;
    districtId: number;
  }
> {
  /** Foreign key referencing the related post */
  @ForeignKey(() => Post)
  @Column
  declare postId: number;

  /** Foreign key referencing the related district */
  @ForeignKey(() => District)
  @Column
  declare districtId: number;
}
