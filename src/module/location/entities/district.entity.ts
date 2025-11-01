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
    declare districtName: string;

    @ForeignKey(() => City)
    @Column
    declare cityId: number;

    @BelongsTo(() => City)
    declare city: City;

    @BelongsToMany(() => Post, () => PostDistrict)
    declare posts: Post[];
}