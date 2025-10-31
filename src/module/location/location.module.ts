import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { City } from './entities/citis.entity';
import { District } from './entities/district.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostDistrict } from '../post/entities/postDistrict.entity'; 
import { RoleGuard } from 'src/common/guards/role.guard';
import { LocationRepository } from './location.repository';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    SequelizeModule.forFeature([City, District]),
    AuthModule],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository, RoleGuard],
  exports: [SequelizeModule, LocationService],
})
export class LocationModule { }
