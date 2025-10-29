import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator'
import { UserRole } from '../entities/user.entity'

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty({ message: 'New password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsPhoneNumber('IR', { message: 'invalid phoneNumber Iranian' })
    phoneNumber: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole = UserRole.USER;

    @IsEmail()
    email: string;
}