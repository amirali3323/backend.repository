import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PostImage } from "../entities/postImage.entity";

@Injectable()
export class PostImageRepository {
    constructor(
        @InjectModel(PostImage)
        private postImageModel: typeof PostImage,
    ) { }

    async create(imageUrl: string, postId: number) {
        return await this.postImageModel.create({imageUrl, postId})
    }
}