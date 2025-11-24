import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  /** New password (min 8 chars) */
  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;

  /** Reset token sent via email */
  @IsNotEmpty({ message: 'Token is required' })
  token: string;
}
