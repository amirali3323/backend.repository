import { Model, Column, DataType, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { NotificationType } from 'src/common/enums/index';
import { User } from 'src/module/auth/entities/user.entity';

@Table({ tableName: 'notification' })
export class Notification extends Model<Notification, {}> {
  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => User)
  @Column
  declare userId: number;

  @Column({
    type: DataType.ENUM(...Object.values(NotificationType)),
    allowNull: false,
  })
  declare type: NotificationType;

  @Column({
    type: DataType.STRING,
  })
  declare message: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isRead: boolean;
}
