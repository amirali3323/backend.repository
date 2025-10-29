import { IsNotEmpty, IsString, MinLength, } from "class-validator";

export class LoginUserDto{
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'password must be at least 6 characters' })
    password: string;
}