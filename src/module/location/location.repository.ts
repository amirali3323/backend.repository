import { CreateCityDto } from "./dto/createCity.dto";
import { CreateDistrictDto } from "./dto/createDistrict.dto";
import { City } from "./entities/citis.entity";
import { District } from "./entities/district.entity";
import { InjectModel } from "@nestjs/sequelize";
import { ILocationRepository } from "./interfaces/location.repository.interface";

export class LocationRepository implements ILocationRepository {
    constructor(
        @InjectModel(City)
        private cityModel: typeof City,
        @InjectModel(District)
        private districtModel: typeof District,
    ) { }

    async createCity(data: { name: string; }): Promise<City> {
        return await this.cityModel.create(data);
    }
    async createDistrict(data: { cityId: number; name: string; }): Promise<District> {
        return await this.districtModel.create(data);
    }
    async findCityByName(name: string): Promise<City | null> {
        return await this.cityModel.findOne({ where: { name } });
    }
    async findCityById(id: number): Promise<City | null> {
        return await this.cityModel.findByPk(id);
    }
    async findDistrictByName(name: string, cityId: number): Promise<District | null> {
        return await this.districtModel.findOne({where: {name, cityId}});
    }
    async findDistrictById(id: number): Promise<District | null> {
        return await this.districtModel.findByPk(id);
    }
    async deleteCity(id: number): Promise<void> {
        await this.cityModel.destroy({where: {id}});
    }
    async deleteDistrict(id: number): Promise<void> {
        await this.districtModel.destroy({where: {id}});
    }
    async findAllCity(): Promise<City[]> {
        return await this.cityModel.findAll()
    }
    async findAllDistrict(cityId: number): Promise<District[]> {
        return await this.districtModel.findAll({where: {cityId}});
    }
}