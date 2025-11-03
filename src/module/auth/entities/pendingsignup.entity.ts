import { Table, Column, Model, DataType } from 'sequelize-typescript';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
@Table({ tableName: 'pendingsignup' })
export class PendingSignup extends Model<
  PendingSignup,
  {
    name: string;
    password: string;
    phoneNumber: string;
    email: string;
    code: string;
  }
> {
  // User full name (signup in progress)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  // Hashed password for pending user
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  // Phone number for verification
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phoneNumber: string;

  // Email for verification
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  // Verification code sent to user
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare code: string;
}
