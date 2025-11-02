import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleGuard } from 'src/common/guards/role.guard';
import { LocationRepository } from './repositories/location.repository'; 
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    SequelizeModule.forFeature([Province, District]),
    AuthModule],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository, RoleGuard],
  exports: [SequelizeModule, LocationService],
})
export class LocationModule { }
