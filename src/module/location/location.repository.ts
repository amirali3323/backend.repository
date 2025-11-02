import { District } from "./entities/district.entity";
import { InjectModel } from "@nestjs/sequelize";
import { Includeable, WhereOptions } from "sequelize";

export class LocationRepository {
    constructor(
        @InjectModel(District)
        private districtModel :typeof District,
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
}