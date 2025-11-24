import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class SignupDto {
  /** Full name of the user */
  @IsString()
  @IsNotEmpty()
  name: string;

  /** Password, min 8 chars */
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  /** Phone number in IR format */
  @IsPhoneNumber('IR', { message: 'Invalid Iranian phone number' })
  phoneNumber: string;

  /** User role (optional, default USER) */
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.USER;

  /** User email */
  @IsEmail()
  email: string;
}
