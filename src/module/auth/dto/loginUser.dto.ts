import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ example: 'ali@example.com', description: 'User email address' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'mypassword123', description: 'User password' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'password must be at least 6 characters' })
    password: string;
}