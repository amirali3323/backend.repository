import { HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/createUser.dto';
import { AuthRepository } from './auth.repository';
import { AppException } from 'src/common/AppException';
import { User, UserRole } from './entities/user.entity';
import { LoginUserDto } from './dto/loginUser.dto';
import { HashRepository } from 'src/common/repositories/hash.repository'
import { CustomJwtService } from 'src/common/services/jwt.service';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository,
    private readonly hashRepository: HashRepository,
    private readonly jwtService: CustomJwtService,
  ) { }

  async signUp(signupDto: SignupDto) {
    console.log(signupDto.userName);
    const exsistUsername = await this.authRepository.findByUsername(signupDto.userName);
    if (exsistUsername) throw new AppException('UserName already exsists', HttpStatus.CONFLICT);
    const exsistphoneNumber = await this.authRepository.findByPhoneNumber(signupDto.phoneNumber);
    if (exsistphoneNumber) throw new AppException('PhoneNumber already exsist', HttpStatus.CONFLICT);
    if (signupDto.email) {
      const exsistEmail = await this.authRepository.findByEmail(signupDto.email);
      if (exsistEmail) throw new AppException('Email already exsists!', HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.hashRepository.hash(signupDto.password);

    const newUser = await this.authRepository.createUser({
      role: signupDto.role ?? UserRole.USER,
      userName: signupDto.userName,
      password: hashedPassword,
      phoneNumber: signupDto.phoneNumber,
      email: signupDto.email,
      profile: signupDto.profile,
    });
    const token = await this.jwtService.sign(newUser.id);
    return { token };

  }

  async login(loginUserDto: LoginUserDto) {
    const exsistUser = await this.authRepository.findByUsername(loginUserDto.userName);
    if (!exsistUser) throw new AppException('UserName not found', HttpStatus.UNAUTHORIZED);

    const isMatch = await this.hashRepository.compare(loginUserDto.password, exsistUser.password);
    if (!isMatch) throw new AppException('Password wrong', HttpStatus.UNAUTHORIZED);
    const token = await this.jwtService.sign(exsistUser.id);
    return { token };
  }

  async getUser(id: number) {
    const user = await this.authRepository.findById(id);
    if (!user) throw new AppException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async getAllUser() {
    const users = await this.authRepository.getAll();
    return users;
  }

}
