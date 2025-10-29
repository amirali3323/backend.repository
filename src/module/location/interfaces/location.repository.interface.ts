import { CreateCityDto } from "../dto/createCity.dto";
import { City } from "../entities/citis.entity";
import { District } from "../entities/district.entity";

export interface ILocationRepository {
    createCity(data: {
        name: string,
    }): Promise<City>;
    createDistrict(data: {
        cityId: number,
        name: string,
    }): Promise<District>;
    findCityByName(name: string): Promise<City | null>;
    findCityById(id: number): Promise<City | null>;
    findDistrictByName(name: string, cityId: number): Promise<District | null>;
    findDistrictById(id: number): Promise<District | null>;
    deleteCity(id: number): Promise<void>;
    deleteDistrict(id: number): Promise<void>;
    findAllCity(): Promise<City[]>;
    findAllDistrict(cityId: number): Promise<District[]>;
}