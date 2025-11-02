import { Post, PostType, StatusPost } from "../entities/post.entity";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { District } from "../../location/entities/district.entity";
import { SubCategory } from "../entities/subCategory.entity";
import { Province } from "src/module/location/entities/province.entity";
import { Category } from "../entities/category.entity";
import { PostImage } from "../entities/postImage.entity";

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    @InjectModel(SubCategory)
    private subCategoryModel: typeof SubCategory
  ) { }

  async findSubCategoryByName(categoryName: string, subCategoryName: string) {
    return await this.subCategoryModel.findOne({
      where: { subCategoryName },
      include: [
        {
          model: Category,
          where: { categoryName },
          attributes: ['id', 'categoryName'],
          required: true,
        },
      ],
    });
  }

  async create(data: {
    title: string,
    description?: string,
    type: PostType,
    mainImage?: string,
    userId: number,
    subCategoryId: number,
    hidePhoneNumber: boolean,
    isWillingToChat: boolean,
  }): Promise<Post> {
    return await this.postModel.create(data);
  }

  async getPost(id: number) {
    return await this.postModel.findOne({
      where: { id },
      include:
        [
          {
            model: SubCategory,
            attributes: ['subCategoryName'],
            required: true,
            include: [
              {
                model: Category,
                attributes: ['categoryName'],
                required: true,
              }
            ]
          },
          {
            model: District,
            through: { attributes: [] },
            attributes: ['districtName'],
            required: true,
            include: [
              {
                model: Province,
                attributes: ['provinceName'],
                required: true,
              }
            ]
          },
          {
            model: PostImage,
            attributes: ['imageUrl'],
          }
        ]
    })
  }
}
