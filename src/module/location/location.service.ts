import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/createCity.dto';
import { LocationRepository } from './location.repository';
import { AppException } from 'src/common/exceptions/AppException';
import { CreateDistrictDto } from './dto/createDistrict.dto';
import { Op } from 'sequelize';
import { District } from './entities/district.entity';
import { LocationInputDto } from '../post/dto/locationInput.dto';
import { City } from './entities/citis.entity';


@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) { }

  async getAllDistrictIdsWithNames(locationInputs: LocationInputDto[]): Promise<number[]> {
    const districts = await this.locationRepository.findALlDistricts({
      include: [
        {
          model: City,
          where: {
            cityName: { [Op.in]: locationInputs.map(loc => loc.cityName) },
          },
          attributes: [],
        },
      ],
      where: {
        districtName: { [Op.in]: locationInputs.map(loc => loc.districtName) },
      },
      attributes: ['id'],
      raw: true,
    });

    return districts.map(d => d.id);
  }

}
