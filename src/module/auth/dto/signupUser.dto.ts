import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator'
import { UserRole } from '../entities/user.entity'
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    @ApiProperty({ example: 'Ali Rezaei', description: 'Full name of the user' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'secret123', description: 'Password, min 6 chars' })
    @IsNotEmpty({ message: 'New password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @ApiProperty({ example: '+989123456789', description: 'Phone number in IR format' })
    @IsPhoneNumber('IR', { message: 'invalid phoneNumber Iranian' })
    phoneNumber: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole = UserRole.USER;

    @ApiProperty({ example: 'ali@example.com', description: 'User email' })
    @IsEmail()
    email: string;
}