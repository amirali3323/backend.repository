import { Table, Model, Column, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import { Post } from './post.entity';

@Table({tableName: 'postDeletionLogs'})
export class PostDeletionLogs extends Model<
  PostDeletionLogs,
  {
    postId: number;
    reason: string;
  }
> {
  @BelongsTo(() => Post)
  post: Post;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  postId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reason: string;
}
