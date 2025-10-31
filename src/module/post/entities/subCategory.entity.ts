import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Category } from "./category.entity";
import { Post } from "./post.entity";

@Table({tableName: 'subCategory'})
export class SubCategory extends Model<SubCategory> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare subCategoryName: string;
    
    @BelongsTo(()=> Category)
    declare category: Category;

    @ForeignKey(()=> Category)
    categoryId: number;

    @HasMany(()=> Post)
    posts: Post[];


    
}