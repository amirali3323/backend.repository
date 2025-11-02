import { Table, Column, Model, DataType, HasMany, BelongsTo, } from 'sequelize-typescript'
import { Post } from 'src/module/post/entities/post.entity';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}
@Table({ tableName: 'users' })
export class User extends Model<
    User,
    {
        name: string;
        password: string;
        phoneNumber: string;
        email: string;
    }
> {

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false,
        defaultValue: UserRole.USER,
    })
    declare role: UserRole;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare phoneNumber: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        unique: true
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare avatarUrl?: string;

    @HasMany(() => Post)
    posts: Post[];

}