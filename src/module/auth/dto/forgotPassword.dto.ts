import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({ example: 'ali@example.com', description: 'Email to send reset link' })
    @IsEmail()
    email: string;
}