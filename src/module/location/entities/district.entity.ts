import { Table, Column, DataType, Model, HasMany, AllowNull, ForeignKey, BelongsTo, BelongsToMany } from "sequelize-typescript";
import { City } from "./citis.entity";
import { Post } from "src/module/post/entities/post.entity";
import { PostDistrict } from "./postDistrict.entity";

@Table({ tableName: 'Districts' })
export class District extends Model<District,
    {
        name: string,
        cityId: number,
    }
> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @ForeignKey(() => City)
    @Column
    cityId: number;

    @BelongsTo(() => City)
    city: City;

    @BelongsToMany(() => Post, () => PostDistrict)
    posts: Post[];
}