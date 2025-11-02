import { Table, Column, DataType, Model, HasMany, } from "sequelize-typescript";
import { District } from "./district.entity";

@Table({ tableName: 'Provinces' })
export class Province extends Model<Province> {

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare provinceName: string

    @HasMany(() => District)
    districts: District[];
}