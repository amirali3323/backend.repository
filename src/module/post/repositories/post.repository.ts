import { Post } from '../entities/post.entity';
import { PostStatus, PostType } from 'src/common/enums';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { District } from '../../location/entities/district.entity';
import { SubCategory } from '../entities/subCategory.entity';
import { Province } from 'src/module/location/entities/province.entity';
import { Category } from '../entities/category.entity';
import { PostImage } from '../entities/postImage.entity';
import { Includeable, Op, WhereOptions } from 'sequelize';
import { PostDistrict } from '../entities/postDistrict.entity';
import sequelize from 'sequelize/lib/sequelize';
import { User } from 'src/module/auth/entities/user.entity';
import { PostRejection } from '../entities/postRejection.entity';

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
    // private sequelize: Sequelize,
  ) {}
  /** Find a subcategory by its name and parent category name */
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

  /** Create a new post record */
  async create(data: {
    title: string;
    description?: string;
    type: PostType;
    mainImage?: string;
    userId: number;
    subCategoryId: number;
    hidePhoneNumber: boolean;
    rewardAmount: string;
  }): Promise<Post> {
    return await this.postModel.create(data);
  }

  /** Retrieve a single post with its related data (category, districts, images) */
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

  /** Find all posts with flexible filtering, sorting, and pagination options */
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

  /** Seed default categories and subcategories for initialization */
  async seedCategoriesAndSubCategories() {
    const categories = [
      {
        categoryName: 'کیف و کوله پشتی',
        subCategories: [
          'کیف پول چرمی',
          'کیف پول پارچه ای',
          'کیف دستی زنانه',
          'کیف دستی مردانه',
          'کوله پشتی مدرسه',
          'کوله پشتی کوهنوردی',
          'کیف لپ تاپ',
          'سایر کیف و کوله',
        ],
      },
      {
        categoryName: 'موبایل و تبلت',
        subCategories: [
          'آیفون',
          'سامسونگ',
          'شیائومی',
          'هوآوی',
          'آنر',
          'نوکیا',
          'تبلت سامسونگ',
          'تبلت اپل',
          'سایر موبایل و تبلت',
        ],
      },
      {
        categoryName: 'لپ تاپ و کامپیوتر',
        subCategories: [
          'لپ تاپ ایسر',
          'لپ تاپ لنوو',
          'لپ تاپ اپل',
          'لپ تاپ ایسوس',
          'لپ تاپ دل',
          'لپ تاپ اچ پی',
          'ماوس',
          'کیبورد',
          'هارد اکسترنال',
          'سایر لپ تاپ و کامپیوتر',
        ],
      },
      {
        categoryName: 'کفش و پوشاک',
        subCategories: [
          'کفش ورزشی مردانه',
          'کفش ورزشی زنانه',
          'کفش رسمی مردانه',
          'کفش رسمی زنانه',
          'کت و شلوار',
          'پیراهن مردانه',
          'بلوز زنانه',
          'شلوار جین',
          'کاپشن',
          'سایر پوشاک',
        ],
      },
      {
        categoryName: 'طلا و جواهرات',
        subCategories: [
          'دستبند طلا',
          'گردنبند طلا',
          'انگشتر طلا',
          'گوشواره طلا',
          'ساعت مچی طلا',
          'دستبند نقره',
          'گردنبند نقره',
          'سایر جواهرات',
        ],
      },
      {
        categoryName: 'اسناد و مدارک',
        subCategories: [
          'کارت ملی',
          'گواهینامه',
          'پاسپورت',
          'کارت بانکی',
          'دفترچه بیمه',
          'مدارک دانشگاهی',
          'دفترچه حساب',
          'سایر مدارک',
        ],
      },
      {
        categoryName: 'وسایل نقلیه',
        subCategories: [
          'کلید خودرو',
          'پلاک خودرو',
          'گواهینامه خودرو',
          'کارت خودرو',
          'کلید موتور سیکلت',
          'کلید دوچرخه',
          'سایر وسایل نقلیه',
        ],
      },
      {
        categoryName: 'کتاب و لوازم التحریر',
        subCategories: [
          'کتاب درسی',
          'کتاب دانشگاهی',
          'کتاب داستان',
          'دفتر مشق',
          'جامدادی',
          'خودکار',
          'مداد',
          'سایر لوازم التحریر',
        ],
      },
      {
        categoryName: 'اسباب بازی',
        subCategories: ['عروسک', 'ماشین اسباب بازی', 'لگو', 'پازل', 'توپ', 'دوچرخه کودک', 'اسکوتر', 'سایر اسباب بازی'],
      },
      {
        categoryName: 'حیوانات خانگی',
        subCategories: ['سگ', 'گربه', 'پرنده', 'ماهی', 'همستر', 'لاک پشت', 'سایر حیوانات'],
      },

      {
        categoryName: 'وسایل شخصی',
        subCategories: [
          'عینک آفتابی',
          'عینک طبی',
          'کلید منزل',
          'ساعت مچی',
          'هدفون',
          'شارژر موبایل',
          'پاوربانک',
          'سایر وسایل شخصی',
        ],
      },

      {
        categoryName: 'وسایل ورزشی',
        subCategories: [
          'توپ فوتبال',
          'توپ بسکتبال',
          'توپ والیبال',
          'کفش کوهنوردی',
          'کوله کوهنوردی',
          'دستکش ورزشی',
          'لباس ورزشی',
          'سایر وسایل ورزشی',
        ],
      },
      {
        categoryName: 'ابزار و وسایل',
        subCategories: ['آچار', 'پیچ گوشتی', 'انبردست', 'چکش', 'متر', 'دریل', 'سایر ابزار'],
      },
      {
        categoryName: 'وسایل آشپزخانه',
        subCategories: ['قابلمه', 'ماهی تابه', 'چاقو', 'لیوان', 'پارچ', 'سایر وسایل آشپزخانه'],
      },
      {
        categoryName: 'متفرقه',
        subCategories: ['سایر موارد'],
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

  /** Helper method: pick a random item from an array */
  private random<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /** Seed database with fake posts for testing/demo purposes */
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
        PostStatus.APPROVED,
        PostStatus.APPROVED,
        PostStatus.APPROVED,
        PostStatus.PENDING,
        PostStatus.RESOLVED,
      ]);
      const randomReward = Math.random() > 0.6 ? Math.floor(Math.random() * 300) + 50 : null;

      const post = await this.postModel.create({
        title: postsData[i],
        description: `توضیحات مربوط به "${postsData[i]}"`,
        type: randomType,
        userId: randomUser,
        subCategoryId: randomSub.id,
        hidePhoneNumber: Math.random() > 0.7,
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
    }

    return {
      message: '✅ پست‌های فیک با موفقیت ایجاد شدند',
      totalPosts: createdPosts.length,
    };
  }

  /** Get post counts grouped by status */
  async getPostStatsByStatus(): Promise<any> {
    return await this.postModel.findAll({
      where: { status: { [Op.ne]: PostStatus.DELETED } },
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
      group: ['status'],
      raw: true,
    });
  }

  /** Get post counts grouped by province */
  async getPostCountByProvince(): Promise<any> {
    return await this.postModel.findAll({
      attributes: [
        [sequelize.col('Districts.Province.provinceName'), 'provinceName'],
        [sequelize.fn('COUNT', sequelize.col('Post.id')), 'count'],
      ],
      include: [
        {
          model: District,
          attributes: [],
          through: { attributes: [] },
          include: [
            {
              model: Province,
              attributes: [],
            },
          ],
        },
      ],
      group: ['Districts.Province.provinceName'],
      raw: true,
    });
  }

  /** Get post counts grouped by type (LOST / FOUND) */
  async getPostCountByType(): Promise<any> {
    return await this.postModel.findAll({
      where: { status: { [Op.ne]: PostStatus.DELETED } },
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('type')), 'count']],
      group: ['type'],
      raw: true,
    });
  }

  /** Get posts filtered by status and/or user with pagination */
  async getPostsByStatus(offset: number, status?: PostStatus, userId?: number): Promise<Post[]> {
    let whereClause: any = {};
    if (status) whereClause.status = status;

    if (userId) whereClause.userId = userId;

    return await this.postModel.findAll({
      where: whereClause,
      attributes: ['id', 'title', 'type', 'mainImage', 'rewardAmount', 'createdAt', 'status'],
      limit: 20,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: District,
          as: 'districts',
          attributes: ['districtName'],
          through: { attributes: [] },
          required: true,
        },
      ],
    });
  }

  /** Get full post details including owner, districts, images, and category */
  async getPostWithUser(id: number): Promise<Post | null> {
    return await this.postModel.findOne({
      where: { id, status: { [Op.ne]: PostStatus.DELETED } },
      attributes: [
        'id',
        'title',
        'description',
        'type',
        'status',
        'mainImage',
        'rewardAmount',
        'hidePhoneNumber',
        'subCategoryId',
        'createdAt',
      ],
      include: [
        {
          model: District,
          through: { attributes: [] },
          attributes: ['districtName', 'id'],
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
          required: false,
          attributes: ['imageUrl'],
        },
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
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phoneNumber', 'createdAt'],
          required: true,
        },
      ],
    });
  }

  /** Update the status of a post */
  async updateStatus(id: number, status: PostStatus) {
    return await this.postModel.update({ status }, { where: { id } });
  }

  /** Find similar posts in the same subcategory and districts, excluding the current post */
  async findSimilarPostById(id: number, subCategoryId: number, districtIds: number[], type: PostType) {
    return await this.postModel.findAll({
      where: { subCategoryId, type, id: { [Op.ne]: id }, status: PostStatus.APPROVED },
      include: [
        {
          model: District,
          where: { id: districtIds },
          through: { attributes: [] },
          required: true,
        },
        { model: User, as: 'owner', attributes: ['email'] },
      ],
    });
  }

  // async getRecommendedPost(id: number, subCategoryId: number, districtIds: number[], type: PostType) {
  //   return await this.postModel.findAll({
  //     where: {subCategoryId, type, id: { [Op.ne]: id}, status: PostStatus.APPROVED},
  //     attributes:
  //   })
  // }

  async getLastApprovedUserPosts(userId: number): Promise<Post[]> {
    return await this.postModel.findAll({
      where: { userId, status: PostStatus.APPROVED },
      attributes: ['id', 'createdAt', 'subCategoryId'],
      include: [
        {
          model: District,
          as: 'districts',
          through: { attributes: [] },
          attributes: ['id'],
          required: true,
        },
      ],
      limit: 3,
      order: [['createdAt', 'DESC']],
    });
  }

  async getPostsWithUserId(userId: number) {
    return await this.postModel.findAll({
      where: { userId, status: { [Op.ne]: PostStatus.DELETED } },
      attributes: ['id', 'title', 'status', 'type', 'createdAt', 'mainImage'],
      include: [
        {
          model: District,
          through: { attributes: [] },
          attributes: ['districtName'],
          required: true,
        },
      ],
    });
  }

  async getMyPost(id: number) {
    return await this.postModel.findOne({
      where: { id, status: { [Op.ne]: PostStatus.DELETED } },
      attributes: [
        'id',
        'title',
        'description',
        'type',
        'status',
        'mainImage',
        'rewardAmount',
        'hidePhoneNumber',
        'userId',
        'createdAt',
      ],
      include: [
        {
          model: District,
          through: { attributes: [] },
          required: true,
          attributes: ['districtName'],
          include: [
            {
              model: Province,
              required: true,
              attributes: ['provinceName'],
            },
          ],
        },
        {
          model: SubCategory,
          attributes: ['subCategoryName'],
          required: true,
          include: [
            {
              model: Category,
              required: true,
              attributes: ['categoryName'],
            },
          ],
        },
        {
          model: PostImage,
          required: false,
          attributes: ['imageUrl'],
        },
        {
          model: PostRejection,
          required: false,
          attributes: ['reason', 'createdAt'],
          separate: true,
          order: [['createdAt', 'DESC']],
        },
      ],
    });
  }

  async delete(id: number) {
    return await this.postModel.update({ status: PostStatus.DELETED }, { where: { id } });
  }
}
