import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator'
import { UserRole } from '../entities/user.entity'

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'password must be at least 6 characters' })
    password: string;

    @IsPhoneNumber('IR', { message: 'invalid phoneNumber Iranian' })
    phoneNumber: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole = UserRole.USER;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    profile?: string;
}