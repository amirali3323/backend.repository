import { IsEmail, IsNotEmpty, IsString, MinLength, } from "class-validator";

export class LoginUserDto {
  /** User email address */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /** User password (min 8 chars) */
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password: string;
}
