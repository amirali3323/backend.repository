import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator'

export class PendingSignupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'password must be at least 6 characters' })
    password: string;

    @IsPhoneNumber('IR', { message: 'invalid phoneNumber Iranian' })
    phoneNumber: string;

    @IsEmail()
    email: string;
}