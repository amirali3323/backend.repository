import { Table, Column, DataType, Model, HasMany, AllowNull, BelongsTo, ForeignKey, BelongsToMany } from "sequelize-typescript";
import { District } from "./district.entity";
import { Post } from "src/module/post/entities/post.entity";
import { PostCity } from "./Postcity.entity";

@Table({ tableName: 'Citis' })
export class City extends Model<
    City,
    { name: string }
> {

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare name: string

    @HasMany(() => District)
    districts: District[];

    @BelongsToMany(() => Post, () => PostCity)
    posts: Post[];
}