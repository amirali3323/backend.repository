import { Table, Column, DataType, Model, HasMany, AllowNull, ForeignKey, BelongsTo, BelongsToMany } from "sequelize-typescript";
import { City } from "./citis.entity";
import { Post } from "src/module/post/entities/post.entity";
import { PostDistrict } from "src/module/post/entities/postDistrict.entity"; 

@Table({ tableName: 'districts' })
export class District extends Model<District> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    districtName: string;

    @ForeignKey(() => City)
    @Column
    cityId: number;

    @BelongsTo(() => City)
    city: City;

    @BelongsToMany(() => Post, () => PostDistrict)
    posts: Post[];
}