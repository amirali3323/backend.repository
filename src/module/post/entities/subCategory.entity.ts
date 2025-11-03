import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Category } from './category.entity';
import { Post } from './post.entity';

@Table({ tableName: 'subCategory' })
export class SubCategory extends Model<SubCategory> {
  /** Name of the subcategory */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare subCategoryName: string;

  /** Parent category that this subcategory belongs to */
  @BelongsTo(() => Category)
  declare category: Category;

  /** Foreign key referencing the parent category */
  @ForeignKey(() => Category)
  declare categoryId: number;

  /** Posts associated with this subcategory */
  @HasMany(() => Post)
  declare posts: Post[];
}
