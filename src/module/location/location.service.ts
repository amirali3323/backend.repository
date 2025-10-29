import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/createCity.dto';
import { LocationRepository } from './location.repository';
import { AppException } from 'src/common/AppException';
import { CreateDistrictDto } from './dto/createDistrict.dto';


@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) { }

  async createCity(createCityDto: CreateCityDto) {
    const exsistCity = await this.locationRepository.findCityByName(createCityDto.name);
    if (exsistCity) throw new AppException('City already exsist', HttpStatus.CONFLICT);
    return await this.locationRepository.createCity({ name: createCityDto.name });
  }

  async createDistrict(createDistrictDto: CreateDistrictDto) {
    const exsistCity = await this.locationRepository.findCityById(createDistrictDto.cityId);
    if (!exsistCity) throw new AppException('City not found', HttpStatus.NOT_FOUND);
    const exsistDistrict = await this.locationRepository.findDistrictByName(createDistrictDto.name, createDistrictDto.cityId);
    if (exsistDistrict) throw new AppException('District already exsist', HttpStatus.CONFLICT);

    return await this.locationRepository.createDistrict({ name: createDistrictDto.name, cityId: createDistrictDto.cityId });
  }

  // async findAllCity() {
  //   return `This action returns all location`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} location`;
  // }

  // update(id: number, updateLocationDto: UpdateLocationDto) {
  //   return `This action updates a #${id} location`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} location`;
  // }
}
