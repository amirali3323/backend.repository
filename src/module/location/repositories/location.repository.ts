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
        provinceName: 'تهران',
        districts: ['تهران', 'ری', 'اسلامشهر', 'شهریار', 'دماوند', 'پردیس', 'ملارد', 'قدس', 'رباط‌کریم', 'بهارستان'],
      },
      {
        provinceName: 'فارس',
        districts: ['شیراز', 'مرودشت', 'کازرون', 'داراب', 'فسا', 'جهرم', 'لار', 'سپیدان', 'اقلید'],
      },
      {
        provinceName: 'اصفهان',
        districts: ['اصفهان', 'کاشان', 'خمینی‌شهر', 'نجف‌آباد', 'شهرضا', 'فلاورجان', 'نطنز', 'گلپایگان'],
      },
      {
        provinceName: 'خراسان رضوی',
        districts: ['مشهد', 'نیشابور', 'سبزوار', 'تربت‌حیدریه', 'کاشمر', 'قوچان', 'تربت‌جام', 'چناران'],
      },
      {
        provinceName: 'گیلان',
        districts: ['رشت', 'انزلی', 'لاهیجان', 'رودسر', 'تالش', 'لنگرود', 'آستارا', 'صومعه‌سرا'],
      },
      {
        provinceName: 'مازندران',
        districts: ['ساری', 'بابل', 'آمل', 'تنکابن', 'قائم‌شهر', 'نور', 'بابلسر', 'چالوس', 'نکا'],
      },
      {
        provinceName: 'آذربایجان شرقی',
        districts: ['تبریز', 'مراغه', 'مرند', 'اهر', 'میانه', 'شبستر', 'سراب', 'بناب'],
      },
      {
        provinceName: 'آذربایجان غربی',
        districts: ['ارومیه', 'خوی', 'بوکان', 'مهاباد', 'میاندوآب', 'سلماس', 'نقده', 'پیرانشهر'],
      },
      {
        provinceName: 'کرمان',
        districts: ['کرمان', 'رفسنجان', 'سیرجان', 'جیرفت', 'بم', 'زرند', 'بردسیر', 'کهنوج'],
      },
      {
        provinceName: 'هرمزگان',
        districts: ['بندرعباس', 'میناب', 'قشم', 'بستک', 'بندر لنگه', 'حاجی‌آباد', 'رودان'],
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
