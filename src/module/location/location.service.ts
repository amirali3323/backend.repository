import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/createCity.dto';
import { LocationRepository } from './repositories/location.repository';
import { AppException } from 'src/common/exceptions/app.exception';
import { CreateDistrictDto } from './dto/createDistrict.dto';
import { Op } from 'sequelize';
import { District } from './entities/district.entity';
import { LocationInputDto } from '../post/dto/locationInput.dto';
import { Province } from './entities/province.entity';


@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) { }

  async getAllDistrictIdsWithNames(locationInputs: LocationInputDto[]): Promise<number[]> {
    const districts = await this.locationRepository.findALlDistricts({
      include: [
        {
          model: Province,
          where: {
            provinceName: { [Op.in]: locationInputs.map(loc => loc.provinceName) },
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

  async getAllIds() {
    return await this.locationRepository.getAllIds();
  }

  async seedIranCitis(){
    await this.locationRepository.seedIranCities();
  }

}
