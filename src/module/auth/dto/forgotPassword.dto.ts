import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  /** User email to send password reset link */
  @IsEmail()
  email: string;
}
