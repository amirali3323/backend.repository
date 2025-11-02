import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { AuthRepository } from './repositories/auth.repository';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { CustomJwtService } from 'src/common/services/jwt.service';
import { PendingSignupRepository } from './repositories/pendingSignup.repository';
import { MailService } from 'src/common/services/mail.service';
import { PendingSignup } from './entities/pendingsignup.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, PendingSignup])],
  exports: [SequelizeModule, AuthService, CustomJwtService, MailService],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, BcryptService, CustomJwtService, PendingSignupRepository, MailService],
})
export class AuthModule {}
