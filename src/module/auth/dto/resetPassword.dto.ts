import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ example: 'newpassword123', description: 'New password (min 6 chars)' })
    @IsNotEmpty({ message: 'New password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    newPassword: string;

    @IsNotEmpty()
    token: string;
}
