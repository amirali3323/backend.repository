import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { SubCategory } from "./subCategory.entity";

@Table({tableName: 'category'})
export class Category extends Model<Category> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    categoryName: string;

    @HasMany(()=> SubCategory)
    subCategorys: SubCategory[];


}