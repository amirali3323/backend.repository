import { IsEmail } from "class-validator";

export class resendVerificationEmailDto {
  @IsEmail()
  email: string;
}