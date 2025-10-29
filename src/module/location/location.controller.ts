import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateCityDto } from './dto/createCity.dto';
import { CreateDistrictDto } from './dto/createDistrict.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(RoleGuard)
  @Roles('admin')
  @Post('createCity')
  createCity(@Body() createCityDto: CreateCityDto ) {
    return this.locationService.createCity(createCityDto);
  }

  @UseGuards(RoleGuard)
  @Roles('admin')
  @Post('createDistrict')
  createDistrict(@Body() createDistrictDto: CreateDistrictDto ) {
    return this.locationService.createDistrict(createDistrictDto);
  }

  // @Get()
  // findAll() {
  //   return this.locationService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.locationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
  //   return this.locationService.update(+id, updateLocationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.locationService.remove(+id);
  // }
}
