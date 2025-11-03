import { Table, Model, Column, BelongsToMany, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Post } from './post.entity';

@Table({ tableName: 'postImages' })
export class PostImage extends Model<
  PostImage,
  {
    imageUrl: string;
    postId: number;
  }
> {
  /** URL of the image related to the post */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare imageUrl: string;

  /** The post that this image belongs to */
  @BelongsTo(() => Post)
  declare post: Post;

  /** Foreign key referencing the related post */
  @ForeignKey(() => Post)
  @Column
  declare postId: number;
}
