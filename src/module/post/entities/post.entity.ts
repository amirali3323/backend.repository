import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, BelongsToMany, } from 'sequelize-typescript'
import { User } from 'src/module/auth/entities/user.entity';
import { District } from 'src/module/location/entities/district.entity';
import { PostDistrict } from './postDistrict.entity';
import { PostImage } from './postImage.entity';
import { SubCategory } from './subCategory.entity';

export enum PostType {
    LOST = 'lost',
    FOUND = 'found',
}

export enum StatusPost {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    RESOLVED = 'RESOLVED',
}

export enum BooleanString {
    TRUE = 'true',
    FALSE = 'false',
}
@Table({ tableName: 'Posts' })
export class Post extends Model<Post,
    {
        title: string,
        description?: string;
        type: PostType,
        mainImage?: string,
        userId: number,
        subCategoryId: number,
        hidePhoneNumber: boolean,
        isWillingToChat: boolean,
    }
> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare description: string;

    @Column({
        type: DataType.ENUM(...Object.values(PostType)),
        allowNull: false,
    })
    declare type: PostType;

    @Column({
        type: DataType.ENUM(...Object.values(StatusPost)),
        allowNull: false,
        defaultValue: StatusPost.PENDING,
    })
    declare status: StatusPost;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare mainImage: string;

    @HasMany(() => PostImage)
    declare images: PostImage[];

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    })
    declare isWillingToChat: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    declare hidePhoneNumber: boolean;

    @BelongsTo(() => User)
    declare user: User;

    @ForeignKey(() => User)
    @Column
    declare userId: number;

    @BelongsToMany(() => District, () => PostDistrict)
    declare districts: District[];

    @BelongsTo(() => SubCategory)
    declare subCategory: SubCategory;

    @ForeignKey(() => SubCategory)
    @Column
    declare subCategoryId: number;
}