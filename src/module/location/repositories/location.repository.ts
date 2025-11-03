import { District } from "../entities/district.entity";
import { InjectModel } from "@nestjs/sequelize";
import { Includeable, WhereOptions } from "sequelize";
import { Province } from "../entities/province.entity";

export class LocationRepository {
    constructor(
        @InjectModel(District)
        private districtModel :typeof District,
        @InjectModel(Province)
        private provinceModel: typeof Province,
    ) { }

    async findALlDistricts(options: {
        where?: WhereOptions<District>,
        attributes?: (keyof District)[],
        include?: Includeable[],
        order?: Array<[string, 'ASC' | 'DESC']>,
        limit?: number,
        offset?: number,
        raw?: boolean,
    }): Promise<District[]> {
        return await this.districtModel.findAll(options);
    }

    async getAllIds() {
      return await this.provinceModel.findAll({
        attributes: ['id', 'provinceName'],
        include: [{
          model: District,
          attributes: ['id', 'districtName'],
          order: [['id', 'ASC']]
        }],
        order: [['id', 'AsC']],
      })
    }
}
