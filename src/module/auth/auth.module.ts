import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { AuthRepository } from './auth.repository';
import { HashRepository } from 'src/common/repositories/hash.repository'
import { CustomJwtService } from 'src/common/services/jwt.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  exports: [SequelizeModule, AuthService, CustomJwtService],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, HashRepository, CustomJwtService],
})
export class AuthModule {}
