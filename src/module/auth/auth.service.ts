import { HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/createUser.dto';
import { AuthRepository } from './auth.repository';
import { AppException } from 'src/common/AppException';
import { User, UserRole } from './entities/user.entity';
import { LoginUserDto } from './dto/loginUser.dto';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { CustomJwtService } from 'src/common/services/jwt.service';
import { PendingSignupRepository } from './pendingSignup.repositort';
import { MailService } from 'src/common/services/mail.service';
import { PendingSignupDto } from './dto/pendingSignup.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import dayjs from 'dayjs';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: CustomJwtService,
    private readonly pendingSignupRepository: PendingSignupRepository,
    private readonly mailService: MailService,
  ) { }

  async signUp(pendingSignupDto: PendingSignupDto) {
    const exsistphoneNumber = await this.authRepository.findByPhoneNumber(pendingSignupDto.phoneNumber);
    if (exsistphoneNumber) throw new AppException('PhoneNumber already exsist', HttpStatus.CONFLICT);
    if (pendingSignupDto.email) {
      const exsistEmail = await this.authRepository.findByEmail(pendingSignupDto.email);
      if (exsistEmail) throw new AppException('Email already exsists!', HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.bcryptService.hash(pendingSignupDto.password);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const pendingUser = await this.pendingSignupRepository.createUser({
      name: pendingSignupDto.name,
      password: hashedPassword,
      phoneNumber: pendingSignupDto.phoneNumber,
      email: pendingSignupDto.email,
      code: verificationCode,
    });

    this.mailService.sendEmailVerification(pendingSignupDto.email, verificationCode);
    return { message: 'A verification code has been sent to your email.' };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, code } = verifyEmailDto;
    const pendingSignup = await this.pendingSignupRepository.findByEmail(email);
    if (!pendingSignup) throw new AppException('No pending signup found for this email', HttpStatus.NOT_FOUND);

    if (dayjs().diff(pendingSignup.createdAt, 'minute') > 10) {
      await this.pendingSignupRepository.delete(pendingSignup.id);
      throw new AppException('Verification code has expired. Please sign up again.', HttpStatus.GONE);
    }

    if (pendingSignup.code !== code) throw new AppException('Invalid verification code', HttpStatus.BAD_REQUEST);

    const newUser = await this.authRepository.createUser({
      name: pendingSignup.name,
      password: pendingSignup.password,
      email: pendingSignup.email,
      phoneNumber: pendingSignup.phoneNumber
    })

    await this.pendingSignupRepository.delete(pendingSignup.id);

    const token = this.jwtService.sign(newUser.id);
    return { token };
  }

  async login(loginUserDto: LoginUserDto) {

    const exsistUser = await this.authRepository.findByEmail(loginUserDto.email);
    if (!exsistUser) throw new AppException('No account found with this email address', HttpStatus.NOT_FOUND);

    const isMatch = await this.bcryptService.compare(loginUserDto.password, exsistUser.password);
    if (!isMatch) throw new AppException('Password wrong', HttpStatus.UNAUTHORIZED);

    const token = await this.jwtService.sign(exsistUser.id);
    return { token };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const exsistUser = await this.authRepository.findByEmail(email)
    if (!exsistUser) throw new AppException('User not found', HttpStatus.NOT_FOUND);

    const token = await this.jwtService.sign(exsistUser.id, { expiresIn: '10m' });

    await this.mailService.sendForgetPasswordEmail(email, token);

    return { message: 'Password reset link sent to your email.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, token: string) {
    if (!token) throw new AppException('Reset token is missing', HttpStatus.BAD_REQUEST)
    const { newPassword } = resetPasswordDto;

    const decoded = await this.jwtService.verify(token);
    if (!decoded?.userId)
      throw new AppException('Invalid or expired token', HttpStatus.UNAUTHORIZED);

    const user = await this.authRepository.findById(decoded.userId);
    if (!user) throw new AppException('User not found', HttpStatus.NOT_FOUND);

    const hashed = await this.bcryptService.hash(newPassword);

    await this.authRepository.updatePassword(user.id, hashed);
    return { message: 'Password has been successfully reset' };
  }

  async updateProfileImage(userId: number, filename: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new AppException('User not found', HttpStatus.NOT_FOUND);

    return await this.authRepository.updateAvatarUrl(filename, userId);
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

