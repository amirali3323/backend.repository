import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './repositories/auth.repository';
import {
  BadRequestException,
  ConflictException,
  GoneException,
  NotFoundException,
  UnauthorizedException,
} from 'src/common/exceptions';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { LoginUserDto } from './dto/loginUser.dto';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { CustomJwtService } from 'src/common/services/jwt.service';
import { PendingSignupRepository } from './repositories/pendingSignup.repository';
import { MailService } from 'src/common/services/mail.service';
import { PendingSignupDto } from './dto/pendingSignup.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import dayjs from 'dayjs';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { resendVerificationEmailDto } from './dto/resendVerificationEmail.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: CustomJwtService,
    private readonly pendingSignupRepository: PendingSignupRepository,
    private readonly mailService: MailService,
  ) {}
  // Find user by ID
  async findByPk(id: number) {
    return await this.authRepository.findById(id);
  }

  // Register a new user (pending) and send verification code
  async signUp(pendingSignupDto: PendingSignupDto) {
    const { email, name, password, phoneNumber } = pendingSignupDto;
    const exsistphoneNumber = await this.authRepository.findByPhoneNumber(phoneNumber);
    if (exsistphoneNumber)
      throw new ConflictException('PhoneNumber already exsist', ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);

    const exsistEmail = await this.authRepository.findByEmail(email);
    if (exsistEmail) throw new ConflictException('Email already exsists!', ErrorCode.EMAIL_ALREADY_EXISTS);

    const hashedPassword = await this.bcryptService.hash(password);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    await this.pendingSignupRepository.deleteByEmail(email);
    await this.pendingSignupRepository.createUser({
      name,
      password: hashedPassword,
      phoneNumber,
      email,
      code: verificationCode,
    });

    this.mailService.sendEmailVerification(pendingSignupDto.email, verificationCode);
    return { message: 'A verification code has been sent to your email.' };
  }

  // Verify email code, create user, send welcome email, return JWT
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, code } = verifyEmailDto;
    const pendingSignup = await this.pendingSignupRepository.verifyEmail(email, code);
    if (!pendingSignup) throw new NotFoundException('Invalid verification code', ErrorCode.INVALID_VERIFICATION_CODE);

    if (dayjs().diff(pendingSignup.createdAt, 'minute') > 10) {
      await this.pendingSignupRepository.delete(pendingSignup.id);
      throw new GoneException(
        'Verification code has expired. Please sign up again.',
        ErrorCode.VERIFICATION_CODE_EXPIRED,
      );
    }

    const newUser = await this.authRepository.createUser({
      name: pendingSignup.name,
      password: pendingSignup.password,
      email: pendingSignup.email,
      phoneNumber: pendingSignup.phoneNumber,
    });
    this.mailService.sendWelcomeEmail(email, newUser.name);
    this.pendingSignupRepository.delete(pendingSignup.id);
    const token = await this.jwtService.sign(newUser.id, { expiresIn: '1d' });
    return {
      token,
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
      avatarUrl: newUser.avatarUrl,
    };
  }

  // Resend verification email with new code
  async resendVerificationEmail(body: resendVerificationEmailDto) {
    const { email } = body;
    const pendingUser = await this.pendingSignupRepository.findLatestByEmail(email);
    if (!pendingUser) throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    await this.pendingSignupRepository.updateVerifyCode(pendingUser.id, verificationCode);

    this.mailService.sendEmailVerification(email, verificationCode);
    return { message: 'A new verification code has been resent to your email.' };
  }

  // Login user, validate password, return JWT
  async login(loginUserDto: LoginUserDto) {
    const exsistUser = await this.authRepository.findByEmail(loginUserDto.email);
    if (!exsistUser) throw new NotFoundException('No account found with this email address', ErrorCode.USER_NOT_FOUND);

    const isMatch = await this.bcryptService.compare(loginUserDto.password, exsistUser.password);
    if (!isMatch) throw new UnauthorizedException('Incorrect password', ErrorCode.INVALID_PASSWORD);

    const token = await this.jwtService.sign(exsistUser.id, { expiresIn: '1d' });
    return {
      token,
      id: exsistUser.id,
      name: exsistUser.name,
      role: exsistUser.role,
      avatarUrl: exsistUser.avatarUrl,
    };
  }

  // Send password reset email with token
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const exsistUser = await this.authRepository.findByEmail(email);
    if (!exsistUser) throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);

    const token = await this.jwtService.sign(exsistUser.id, { expiresIn: '10m' });
    this.mailService.sendForgetPasswordEmail(email, token);
    return { message: 'Password reset link sent to your email.' };
  }

  // Reset user password using token
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { newPassword, token } = resetPasswordDto;

    if (!token) throw new BadRequestException('Reset token is missing', ErrorCode.RESET_TOKEN_MISSING);
    const decoded = await this.jwtService.verify(token);
    if (!decoded?.userId) {
      throw new UnauthorizedException('Invalid or expired token', ErrorCode.INVALID_RESET_TOKEN_PAYLOAD);
    }
    const user = await this.authRepository.findById(decoded.userId);
    if (!user) throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);

    const hashed = await this.bcryptService.hash(newPassword);
    await this.authRepository.updatePassword(user.id, hashed);
    return { message: 'Password has been successfully reset' };
  }

  // Update user profile image
  async updateProfileImage(userId: number, filename: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);

    return await this.authRepository.updateAvatarUrl(filename, userId);
  }

  // Get a single user by ID
  async getUser(id: number) {
    const user = await this.authRepository.findById(id);
    if (!user) throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);

    return user;
  }

  // Get all users
  async getAllUser() {
    const users = await this.authRepository.getAll();
    return users;
  }

  // Get phone number of a user by ID
  async getPhoneNumber(id: number) {
    const user = await this.authRepository.findById(id);
    if (user) return user.phoneNumber;
  }

  /** Get the email of a user by their ID */
  async getEmail(id: number) {
    const user = await this.authRepository.findById(id);
    if (user) return user.email;
  }

  /** Get full user info for the currently logged-in user */
  async getMe(userId: number) {
    const user = await this.authRepository.findById(userId);
  }

  /** Count all users */
  async getUserCounts() {
    return await this.authRepository.getUserCount();
  }
}
