import { Province } from "../entities/province.entity";
import { District } from "../entities/district.entity";

export interface ILocationRepository {
    createProvince(data: {
        name: string,
    }): Promise<Province>;
    createDistrict(data: {
        ProvinceId: number,
        name: string,
    }): Promise<District>;
    findProvinceByName(name: string): Promise<Province | null>;
    findProvinceById(id: number): Promise<Province | null>;
    findDistrictByName(name: string, ProvinceId: number): Promise<District | null>;
    findDistrictById(id: number): Promise<District | null>;
    deleteProvince(id: number): Promise<void>;
    deleteDistrict(id: number): Promise<void>;
    findAllProvince(): Promise<Province[]>;
    findAllDistrict(ProvinceId: number): Promise<District[]>;
}