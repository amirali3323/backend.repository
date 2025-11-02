import { Table, Column, Model, DataType, } from 'sequelize-typescript'

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
    })
    declare phoneNumber: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare code: string;
}