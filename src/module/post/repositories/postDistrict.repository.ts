import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PostDistrict } from "../entities/postDistrict.entity";

@Injectable()
export class PostDistricRepository {
    constructor(
        @InjectModel(PostDistrict)
        private postDistricModel: typeof PostDistrict,
    ) { }

    async create(postId: number, districtId: number) {
        return await this.postDistricModel.create({postId, districtId});
    }
}