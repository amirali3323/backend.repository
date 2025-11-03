import { IsEmail, IsNotEmpty, IsString, MinLength, } from "class-validator";

export class LoginUserDto {
  /** User email address */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /** User password (min 6 chars) */
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  password: string;
}
