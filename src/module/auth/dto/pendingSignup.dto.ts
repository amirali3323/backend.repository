import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator'

export class PendingSignupDto {
  /** Full name of pending user */
  @IsString()
  @IsNotEmpty()
  name: string;

  /** Password for pending signup (min 6 chars) */
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  password: string;

  /** Phone number (Iran format) */
  @IsPhoneNumber('IR', { message: 'invalid phoneNumber Iranian' })
  phoneNumber: string;

  /** User email */
  @IsEmail()
  email: string;
}
