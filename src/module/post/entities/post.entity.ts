import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, BelongsToMany, } from 'sequelize-typescript'
import { User } from 'src/module/auth/entities/user.entity';
import { District } from 'src/module/location/entities/district.entity';
import { PostDistrict } from 'src/module/location/entities/postDistrict.entity';
import { PostImage } from './postImage.entity';
import { SubCategory } from './subCategory.entity';

export enum PostType {
    LOST = 'lost',
    FOUND = 'found',
}

export enum StatusPost {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    RESOLVED = 'resolved',
}
@Table({ tableName: 'Posts' })
export class Post extends Model<Post> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description: string;

    @Column({
        type: DataType.ENUM(...Object.values(PostType)),
        allowNull: false,
    })
    type: PostType;

    @Column({
        type: DataType.ENUM(...Object.values(StatusPost)),
        allowNull: false,
        defaultValue: StatusPost.ACTIVE,
    })
    status: StatusPost;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    image: string;

    @HasMany(() => PostImage)
    images: PostImage[];

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsToMany(() => District, () => PostDistrict)
    districts: District[];

    @BelongsTo(() => SubCategory)
    subCategory: SubCategory;

    @ForeignKey(() => SubCategory)
    @Column
    subCategoryId: number;
}