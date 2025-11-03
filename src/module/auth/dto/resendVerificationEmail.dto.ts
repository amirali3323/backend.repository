import { IsEmail } from 'class-validator';

export class resendVerificationEmailDto {
  /** User email to send password reset link */
  @IsEmail()
  email: string;
}
