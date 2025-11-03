import { Post, PostType, StatusPost } from '../entities/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { District } from '../../location/entities/district.entity';
import { SubCategory } from '../entities/subCategory.entity';
import { Province } from 'src/module/location/entities/province.entity';
import { Category } from '../entities/category.entity';
import { PostImage } from '../entities/postImage.entity';
import { Includeable, WhereOptions } from 'sequelize';
import { PostDistrict } from '../entities/postDistrict.entity';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    @InjectModel(SubCategory)
    private subCategoryModel: typeof SubCategory,
    @InjectModel(Category)
    private categoryModel: typeof Category,
    @InjectModel(District)
    private districtModel: typeof District,
    @InjectModel(PostDistrict)
    private postDistricModel: typeof PostDistrict,
  ) {}

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
    title: string;
    description?: string;
    type: PostType;
    mainImage?: string;
    userId: number;
    subCategoryId: number;
    hidePhoneNumber: boolean;
    isWillingToChat: boolean;
    rewardAmount: number;
  }): Promise<Post> {
    return await this.postModel.create(data);
  }

  async getPost(id: number) {
    return await this.postModel.findOne({
      where: { id },
      include: [
        {
          model: SubCategory,
          attributes: ['subCategoryName'],
          required: true,
          include: [
            {
              model: Category,
              attributes: ['categoryName'],
              required: true,
            },
          ],
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
            },
          ],
        },
        {
          model: PostImage,
          attributes: ['imageUrl'],
        },
      ],
    });
  }

  async findAll(options: {
    where?: WhereOptions<Post>;
    attributes?: (keyof Post)[];
    include?: Includeable[];
    order?: Array<[string, 'ASC' | 'DESC']>;
    limit?: number;
    offset?: number;
    raw?: boolean;
  }): Promise<Post[]> {
    return await this.postModel.findAll(options);
  }

  async seedCategoriesAndSubCategories() {
    const categories = [
      {
        categoryName: 'موبایل',
        subCategories: ['آیفون', 'سامسونگ', 'شیائومی', 'هوآوی', 'نوکیا', 'دیگر برندها'],
      },
      {
        categoryName: 'مدارک و اسناد',
        subCategories: ['کارت ملی', 'شناسنامه', 'گواهینامه', 'پاسپورت', 'کارت بانکی', 'کارت دانشجویی'],
      },
      {
        categoryName: 'حیوانات خانگی',
        subCategories: ['سگ', 'گربه', 'طوطی', 'ماهی', 'خرگوش', 'لاک‌پشت'],
      },
      {
        categoryName: 'وسایل نقلیه',
        subCategories: ['موتور سیکلت', 'دوچرخه', 'خودرو', 'پلاک', 'کلید خودرو'],
      },
      {
        categoryName: 'کیف و لوازم شخصی',
        subCategories: ['کیف پول', 'کوله پشتی', 'عینک', 'ساعت', 'کلید', 'زیورآلات'],
      },
      {
        categoryName: 'لوازم الکترونیکی',
        subCategories: ['لپ‌تاپ', 'تبلت', 'هدفون', 'فلش مموری', 'دوربین', 'شارژر'],
      },
      {
        categoryName: 'پوشاک',
        subCategories: ['کفش', 'لباس', 'کلاه', 'روسری', 'دستکش', 'ساعت مچی'],
      },
    ];

    let subCount = 0;

    for (const cat of categories) {
      const [category] = await this.categoryModel.findOrCreate({
        where: { categoryName: cat.categoryName },
      });

      for (const sub of cat.subCategories) {
        await this.subCategoryModel.findOrCreate({
          where: { subCategoryName: sub, categoryId: category.id },
        });
        subCount++;
      }
    }
  }

  private random<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async seedFakePosts() {
    const subCategories = await this.subCategoryModel.findAll();
    const districts = await this.districtModel.findAll();

    if (!subCategories.length || !districts.length) {
      throw new Error('ابتدا دسته‌بندی‌ها و مناطق را Seed کنید.');
    }

    const postsData = [
      'کارت ملی گم شده در خیابان ولیعصر',
      'سگ گمشده در پارک ملت',
      'گوشی سامسونگ پیدا شده در مترو صادقیه',
      'کیف پول پیدا شده در شیراز',
      'کلید خودرو پژو در خیابان نیاوران',
      'عینک افتاده در پیاده‌رو انقلاب',
      'مدرک دانشگاهی پیدا شده در تبریز',
      'پلاک موتور گمشده در اهواز',
      'ساعت مچی پیدا شده در اصفهان',
      'کفش گم‌شده در پارک ارم',
      'پاسپورت گم شده در میدان آزادی',
      'تبلت پیدا شده در تاکسی',
      'کارت بانکی ملت گمشده در کرج',
      'گوشی آیفون پیدا شده در شیراز',
      'دوربین گم‌شده در مشهد',
      'گربه سفید گمشده در نیاوران',
      'کیف لپ‌تاپ پیدا شده در قم',
      'کلاه گم‌شده در کرمانشاه',
      'خرگوش پیدا شده در پارک لاله',
      'زیورآلات گمشده در مترو تهران',
    ];

    const createdPosts = [];

    for (let i = 0; i < postsData.length; i++) {
      const randomSub = this.random(subCategories);
      const randomUser = Math.floor(Math.random() * 3) + 1;
      const randomType = this.random([PostType.LOST, PostType.FOUND]);
      const randomStatus = this.random([
        StatusPost.APPROVED,
        StatusPost.APPROVED,
        StatusPost.APPROVED,
        StatusPost.PENDING,
        StatusPost.RESOLVED,
      ]);
      const randomReward = Math.random() > 0.6 ? Math.floor(Math.random() * 300) + 50 : null;

      const post = await this.postModel.create({
        title: postsData[i],
        description: `توضیحات مربوط به "${postsData[i]}"`,
        type: randomType,
        userId: randomUser,
        subCategoryId: randomSub.id,
        hidePhoneNumber: Math.random() > 0.7,
        isWillingToChat: Math.random() > 0.3,
        rewardAmount: 111,
        status: randomStatus,
      });

      // هر پست به ۱ تا ۳ منطقه تعلق می‌گیره
      const districtCount = Math.floor(Math.random() * 3) + 1;
      const shuffledDistricts = districts.sort(() => 0.5 - Math.random()).slice(0, districtCount);

      for (const d of shuffledDistricts) {
        await this.postDistricModel.create({
          postId: post.id,
          districtId: d.id,
        });
      }

      // createdPosts.push(post);
    }

    return {
      message: '✅ پست‌های فیک با موفقیت ایجاد شدند',
      totalPosts: createdPosts.length,
    };
  }
}
