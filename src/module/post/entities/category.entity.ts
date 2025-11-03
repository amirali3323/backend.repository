import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { SubCategory } from './subCategory.entity';

/** Category entity - represents a main post category (e.g., Electronics, Pets) */
@Table({ tableName: 'category' })
export class Category extends Model<Category> {
  /** Unique category name */
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare categoryName: string;

  /** Related subcategories under this category */
  @HasMany(() => SubCategory)
  subCategorys: SubCategory[];
}
