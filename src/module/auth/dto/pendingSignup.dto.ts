import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator'

export class PendingSignupDto {
    @ApiProperty({ example: 'Ali Rezaei', description: 'Full name of pending user' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'secret123', description: 'Password for pending signup' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'password must be at least 6 characters' })
    password: string;

    @ApiProperty({ example: '+989123456789', description: 'Phone number (Iran format)' })
    @IsPhoneNumber('IR', { message: 'invalid phoneNumber Iranian' })
    phoneNumber: string;

    @ApiProperty({ example: 'ali@example.com', description: 'User email' })
    @IsEmail()
    email: string;
}