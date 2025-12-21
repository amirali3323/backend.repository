import { Injectable } from '@nestjs/common';
import { LocationRepository } from './repositories/location.repository';
import { Op } from 'sequelize';
import { LocationInputDto } from '../post/dto/locationInput.dto';
import { Province } from './entities/province.entity';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  async getAllDistrictIdsWithNames(locationInputs: LocationInputDto[]): Promise<number[]> {
    const districts = await this.locationRepository.findALlDistricts({
      include: [
        {
          model: Province,
          where: {
            provinceName: { [Op.in]: locationInputs.map((loc) => loc.provinceName) },
          },
          attributes: [],
        },
      ],
      where: {
        districtName: { [Op.in]: locationInputs.map((loc) => loc.districtName) },
      },
      attributes: ['id'],
      raw: true,
    });

    return districts.map((d) => d.id);
  }

  async getAllIds() {
    return await this.locationRepository.getAllIds();
  }

  async seedIranCitis() {
    await this.locationRepository.seedIranCities();
  }

  async getPostProvinceCount() {
    const rows = await this.locationRepository.getPostCountByProvince();

    const result = rows.reduce(
      (acc, row) => {
        acc[row.provinceName] = Number(row.count);
        return acc;
      },
      {} as Record<string, number>,
    );

    return result;
  }
}
