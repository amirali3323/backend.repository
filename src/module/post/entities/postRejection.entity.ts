import { Table, Column, DataType, BelongsTo, ForeignKey, Model } from 'sequelize-typescript';
import { Post } from './post.entity';

@Table({ tableName: 'postRejection' })
export class PostRejection extends Model<PostRejection,{
  reason: string;
  postId: number;
}> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare reason: string;

  @BelongsTo(() => Post)
  post: Post;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare postId: number;
}
