import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Post } from "src/module/post/entities/post.entity";
import { District } from "./district.entity";

@Table({ tableName: 'PostDistricts' })
export class PostDistrict extends Model<PostDistrict> {
  @ForeignKey(() => Post) @Column postId: number;
  @ForeignKey(() => District) @Column districtId: number;
}
