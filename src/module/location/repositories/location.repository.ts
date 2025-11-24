import { District } from '../entities/district.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, WhereOptions } from 'sequelize';
import { Province } from '../entities/province.entity';
import path from 'path';
import * as fs from 'fs';

export class LocationRepository {
  constructor(
    @InjectModel(District)
    private districtModel: typeof District,
    @InjectModel(Province)
    private provinceModel: typeof Province,
  ) {}

  async findALlDistricts(options: {
    where?: WhereOptions<District>;
    attributes?: (keyof District)[];
    include?: Includeable[];
    order?: Array<[string, 'ASC' | 'DESC']>;
    limit?: number;
    offset?: number;
    raw?: boolean;
  }): Promise<District[]> {
    return await this.districtModel.findAll(options);
  }

  async getAllIds() {
    return await this.provinceModel.findAll({
      attributes: ['id', 'provinceName'],
      include: [
        {
          model: District,
          attributes: ['id', 'districtName'],
          order: [['id', 'ASC']],
        },
      ],
      order: [['id', 'AsC']],
    });
  }
  async seedIranCities() {
    const provincesData = [
      {
        provinceName: 'آذربایجان شرقی',
        districts: ['تبریز', 'مراغه', 'مرند', 'اهر', 'میانه', 'شبستر', 'سراب', 'بناب', 'هریس', 'کلیبر'],
      },
      {
        provinceName: 'آذربایجان غربی',
        districts: ['ارومیه', 'خوی', 'مهاباد', 'بوکان', 'میاندوآب', 'سلماس', 'نقده', 'پیرانشهر', 'شاهین‌دژ', 'سردشت'],
      },
      {
        provinceName: 'اردبیل',
        districts: ['اردبیل', 'مشگین‌شهر', 'خلخال', 'گرمی', 'بیله‌سوار', 'نمین', 'کوثر', 'سرعین', 'نیر', 'اصلاندوز'],
      },
      {
        provinceName: 'اصفهان',
        districts: [
          'اصفهان',
          'کاشان',
          'نجف‌آباد',
          'خمینی‌شهر',
          'فلاورجان',
          'نطنز',
          'گلپایگان',
          'شهرضا',
          'برخوار',
          'سمیرم',
        ],
      },
      {
        provinceName: 'البرز',
        districts: [
          'کرج',
          'نظرآباد',
          'اشتهارد',
          'طالقان',
          'ساوجبلاغ',
          'کمال‌شهر',
          'هشتگرد',
          'محمدشهر',
          'گرمدره',
          'نظرآباد مرکزی',
        ],
      },

      {
        provinceName: 'ایلام',
        districts: [
          'ایلام',
          'دهلران',
          'ایوان',
          'مهران',
          'دره‌شهر',
          'شیروان چرداول',
          'آبدانان',
          'سرابله',
          'آسمان‌نما',
          'ایلام مرکزی',
        ],
      },
      {
        provinceName: 'بوشهر',
        districts: ['بوشهر', 'برازجان', 'کنگان', 'دیر', 'گناوه', 'خورموج', 'تنگستان', 'جم', 'اهرم', 'شادگان بوشهر'],
      },
      {
        provinceName: 'تهران',
        districts: [
          'تهران',
          'ری',
          'اسلامشهر',
          'شهریار',
          'دماوند',
          'پردیس',
          'ملارد',
          'قدس',
          'رباط‌کریم',
          'بهارستان',
          'فیروزکوه',
          'ورامین',
          'پاکدشت',
          'رباط کریم شمالی',
          'ساوجبلاغ',
        ],
      },
      {
        provinceName: 'چهارمحال و بختیاری',
        districts: ['شهرکرد', 'بروجن', 'فارسان', 'لردگان', 'سامان', 'کوهرنگ', 'بن', 'خانمیرزا', 'کیار', 'اردل'],
      },

      {
        provinceName: 'خراسان جنوبی',
        districts: ['بیرجند', 'طبس', 'فردوس', 'قاین', 'نهبندان', 'سربیشه', 'بشرویه', 'خوسف', 'درمیان', 'سرایان'],
      },

      {
        provinceName: 'خراسان رضوی',
        districts: [
          'مشهد',
          'نیشابور',
          'تربت حیدریه',
          'تربت جام',
          'سبزوار',
          'چناران',
          'کاشمر',
          'فیروزه',
          'جوین',
          'بردسکن',
        ],
      },
      {
        provinceName: 'خراسان شمالی',
        districts: [
          'بجنورد',
          'شیروان',
          'اسفراین',
          'جاجرم',
          'آشخانه',
          'گرمه',
          'راز و جرگلان',
          'سنخواست',
          'صفی‌آباد',
          'آوا',
        ],
      },
      {
        provinceName: 'خوزستان',
        districts: [
          'اهواز',
          'آبادان',
          'خرمشهر',
          'دزفول',
          'شوشتر',
          'اندیمشک',
          'ماهشهر',
          'شادگان',
          'ایذه',
          'بندر امام خمینی',
        ],
      },
      {
        provinceName: 'زنجان',
        districts: [
          'زنجان',
          'ابهر',
          'خرمدره',
          'طارم',
          'ماهنشان',
          'سلطانیه',
          'دندی',
          'هیدج',
          'کردکوی زنجان',
          'زرین‌آباد',
        ],
      },

      {
        provinceName: 'سمنان',
        districts: [
          'سمنان',
          'شاهرود',
          'دامغان',
          'گرمسار',
          'مهدی‌شهر',
          'سرخه',
          'ایوانکی',
          'بسطام',
          'شهمیرزاد',
          'کلاته خیج',
        ],
      },
      {
        provinceName: 'سیستان و بلوچستان',
        districts: ['زاهدان', 'زابل', 'چابهار', 'خاش', 'ایرانشهر', 'سراوان', 'کنارک', 'نیک‌شهر', 'زهک', 'میرجاوه'],
      },

      {
        provinceName: 'فارس',
        districts: ['شیراز', 'مرودشت', 'کازرون', 'جهرم', 'فسا', 'داراب', 'لار', 'گراش', 'اقلید', 'نی‌ریز'],
      },
      {
        provinceName: 'قزوین',
        districts: [
          'قزوین',
          'البرز',
          'تاکستان',
          'آبیک',
          'بوئین‌زهرا',
          'محمدیه',
          'شریفیه',
          'محمودآباد نمونه',
          'آوج',
          'سیردان',
        ],
      },
      {
        provinceName: 'قم',
        districts: ['قم', 'جعفریه', 'قنوات', 'کهک', 'دستجرد', 'سلفچگان', 'خلجستان', 'قمرود', 'راهجرد', 'قاهان'],
      },
      {
        provinceName: 'کردستان',
        districts: ['سنندج', 'سقز', 'مریوان', 'بانه', 'قروه', 'بیجار', 'دهگلان', 'دیواندره', 'کامیاران', 'دلبران'],
      },
      {
        provinceName: 'کرمان',
        districts: ['کرمان', 'رفسنجان', 'سیرجان', 'جیرفت', 'بم', 'زرند', 'کوهبنان', 'راور', 'بردسیر', 'کهنوج'],
      },
      {
        provinceName: 'کرمانشاه',
        districts: [
          'کرمانشاه',
          'اسلام‌آباد غرب',
          'سنقر',
          'کنگاور',
          'صحنه',
          'هرسین',
          'جوانرود',
          'پاوه',
          'سرپل‌ذهاب',
          'گیلانغرب',
        ],
      },
      {
        provinceName: 'کهگیلویه و بویراحمد',
        districts: ['یاسوج', 'گچساران', 'دهدشت', 'دوگنبدان', 'سی‌سخت', 'لیکک', 'چرام', 'باشت', 'مارگون', 'لنده'],
      },
      {
        provinceName: 'گلستان',
        districts: [
          'گرگان',
          'گنبدکاووس',
          'علی‌آباد',
          'کردکوی',
          'مینودشت',
          'رودبار',
          'آق‌قلا',
          'بندرگز',
          'بندرترکمن',
          'گمیشان',
        ],
      },
      {
        provinceName: 'گیلان',
        districts: ['رشت', 'آستانه اشرفیه', 'فومن', 'صومعه‌سرا', 'تالش', 'لنگرود', 'رودسر', 'انزلی', 'ماسال', 'سیاهکل'],
      },
      {
        provinceName: 'لرستان',
        districts: [
          'خرم‌آباد',
          'بروجرد',
          'دورود',
          'کوهدشت',
          'پل‌دختر',
          'ازنا',
          'الیگودرز',
          'شول‌آباد',
          'چگنی',
          'نورآباد',
        ],
      },
      {
        provinceName: 'مازندران',
        districts: ['ساری', 'بابل', 'آمل', 'قائم‌شهر', 'نکا', 'چالوس', 'تنکابن', 'بهشهر', 'سوادکوه', 'نور'],
      },
      {
        provinceName: 'مرکزی',
        districts: ['اراک', 'ساوه', 'خمین', 'دلیجان', 'کمیجان', 'محلات', 'شازند', 'فراهان', 'تفرش', 'آشتیان'],
      },
      {
        provinceName: 'هرمزگان',
        districts: [
          'بندرعباس',
          'بندرچارک',
          'قشم',
          'میناب',
          'بندر لنگه',
          'ابوموسی',
          'کیش',
          'رودان',
          'جاسک',
          'حاجی‌آباد',
        ],
      },
      {
        provinceName: 'همدان',
        districts: ['همدان', 'ملایر', 'نهاوند', 'توابع', 'کبودرآهنگ', 'رزن', 'اسدآباد', 'بهار', 'فیروزان', 'گودرزی'],
      },
      {
        provinceName: 'یزد',
        districts: ['یزد', 'مهریز', 'میبد', 'بافق', 'اردکان', 'طبس', 'تفت', 'ابرکوه', 'خاتم', 'اشکذر'],
      },
    ];

    let districtCount = 0;

    for (const provinceData of provincesData) {
      const [province] = await this.provinceModel.findOrCreate({
        where: { provinceName: provinceData.provinceName },
      });

      for (const districtName of provinceData.districts) {
        await this.districtModel.findOrCreate({
          where: { districtName, provinceId: province.id },
        });
        districtCount++;
      }
    }

    return {
      message: `Seeded Iran provinces and cities successfully`,
      provinces: provincesData.length,
      districts: districtCount,
    };
  }
}
