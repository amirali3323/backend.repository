import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";

export class VerifyEmailDto {
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: 'Verification code is required' })
    @Matches(/^\d+$/, { message: 'Verification code must contain only numbers' })
    @Length(6, 6, { message: 'Verification code must be exactly 6 digits' })
    code: string;
}
