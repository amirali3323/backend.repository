import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";

export class VerifyEmailDto {
    @ApiProperty({ example: 'ali@example.com', description: 'Email address to verify' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', description: '6-digit verification code' })
    @IsNotEmpty({ message: 'Verification code is required' })
    @Matches(/^\d+$/, { message: 'Verification code must contain only numbers' })
    @Length(6, 6, { message: 'Verification code must be exactly 6 digits' })
    code: string;
}
