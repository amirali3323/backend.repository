import { Post, PostType } from "../entities/post.entity";
import { SubCategory } from "../entities/subCategory.entity";

export interface IPostRepository {
  findSubCategoryByName(categoryName: string, subCategoryName: string): Promise<SubCategory | null>;

  create(data: {
    title: string;
    description?: string;
    type: PostType;
    mainImage?: string;
    userId: number;
    subCategoryId: number;
    hidePhoneNumber: boolean;
    isWillingToChat: boolean;
  }): Promise<Post>;

  getPost(id: number): Promise<Post | null>;
}
