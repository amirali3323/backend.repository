import { Table, Column, Model, DataType, HasMany, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { OwnerClaim } from 'src/module/post/entities/ownerClaim.entity';
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
  // User role (admin or regular user)
  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.USER,
  })
  declare role: UserRole;

  // Full name of the user
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  // Hashed password
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  // Unique phone number
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare phoneNumber: string;

  // Unique email
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  // Optional profile picture URL
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare avatarUrl?: string;

  // User's posts (one-to-many relation)
  @HasMany(() => Post)
  posts: Post[];

  @BelongsToMany(()=> Post, ()=> OwnerClaim)
  declare ownerClaims: OwnerClaim[];
}
