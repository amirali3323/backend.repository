import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";

export class VerifyEmailDto {
  /** Email address to verify */
  @IsEmail()
  email: string;

  /** 6-digit numeric verification code */
  @IsNotEmpty({ message: 'Verification code is required' })
  @Matches(/^\d+$/, { message: 'Verification code must contain only numbers' })
  @Length(6, 6, { message: 'Verification code must be exactly 6 digits' })
  code: string;
}
