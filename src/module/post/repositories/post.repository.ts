import { Post, PostType, StatusPost } from "../entities/post.entity";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { District } from "../../location/entities/district.entity";
import { SubCategory } from "../entities/subCategory.entity";

@Injectable()
export class PostRepository {
    constructor(
        @InjectModel(Post)
        private postModel: typeof Post,
        @InjectModel(District)
        private districtModel: typeof District,
        @InjectModel(SubCategory)
        private subCategoryModel: typeof SubCategory
    ) { }

    async findSubCategoryByName(subCategoryName: string) {
        return await this.subCategoryModel.findOne({ where: { subCategoryName } })
    }

    async create(data: {
        title: string,
        description?: string,
        type: PostType,
        mainImage?: string,
        userId: number,
        subCategoryId: number,
    }): Promise<Post> {
        return await this.postModel.create(data);
    }
}