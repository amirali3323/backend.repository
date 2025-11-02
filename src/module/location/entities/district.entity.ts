import { Table, Column, DataType, Model, HasMany, AllowNull, ForeignKey, BelongsTo, BelongsToMany } from "sequelize-typescript";
import { Province } from "./province.entity";
import { Post } from "src/module/post/entities/post.entity";
import { PostDistrict } from "src/module/post/entities/postDistrict.entity"; 

@Table({ tableName: 'districts' })
export class District extends Model<District> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare districtName: string;

    @ForeignKey(() => Province)
    @Column
    declare provinceId: number;

    @BelongsTo(() => Province)
    declare province: Province;

    @BelongsToMany(() => Post, () => PostDistrict)
    declare posts: Post[];
}