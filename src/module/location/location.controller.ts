import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('api/location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('get-all-ids')
  async getAllIds() {
    return await this.locationService.getAllIds();
  }

  // @UseGuards(RoleGuard)
  // @Roles('admin')
  // @Post('createCity')
  // createCity(@Body() createCityDto: CreateCityDto ) {
  //   return this.locationService.createCity(createCityDto);
  // }

  // @UseGuards(RoleGuard)
  // @Roles('admin')
  // @Post('createDistrict')
  // createDistrict(@Body() createDistrictDto: CreateDistrictDto ) {
  //   return this.locationService.createDistrict(createDistrictDto);
  // }


}
