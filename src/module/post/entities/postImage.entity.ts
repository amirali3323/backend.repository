import { Table, Model, Column, BelongsToMany, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Post } from "./post.entity";

@Table({tableName: 'postImages'})
export class PostImage extends Model<PostImage,{
    imageUrl: string,
    postId: number,
}> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare imageUrl: string;

    @BelongsTo(()=> Post)
    declare post: Post;

    @ForeignKey(()=> Post)
    @Column
    declare postId: number;
}