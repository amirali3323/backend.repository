import { PostDistrict } from "../entities/postDistrict.entity";


export interface IPostDistrictRepository {
  create(postId: number, districtId: number): Promise<PostDistrict>;
}