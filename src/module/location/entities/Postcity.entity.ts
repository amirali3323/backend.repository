import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { City } from "./citis.entity";
import { Post } from "src/module/post/entities/post.entity";

@Table({ tableName: 'PostCities' })
export class PostCity extends Model<PostCity> {
  @ForeignKey(() => Post) @Column postId: number;
  @ForeignKey(() => City) @Column cityId: number;
}