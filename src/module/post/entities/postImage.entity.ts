import { Table, Model, Column, BelongsToMany, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Post } from "./post.entity";

@Table({tableName: 'postImage'})
export class PostImage extends Model<PostImage> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare imageUrl: string;

    @BelongsTo(()=> Post)
    post: Post;

    @ForeignKey(()=> Post)
    @Column
    postId: number;
}