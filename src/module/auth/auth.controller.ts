import { Controller, Get, Post, Body, Res, Query, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signupUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import type { Response } from 'express';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterConfig } from 'src/common/config/multer.config';
import type { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignupDto })
  @Post('signup')
  async signUp(@Body() signupDto: SignupDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.signUp(signupDto);
  }


  @Post('verify-email')
  @ApiOperation({ summary: 'Verify user email with code' })
  @ApiResponse({ status: 200, description: 'Email verified and user logged in' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyEmail(verifyEmailDto);
    res.cookie('access-token', result.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })
    return { message: 'Login successful', }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user with email and password' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginUserDto);

    res.cookie('access-token', result.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })

    return { message: 'Login successful', }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiResponse({ status: 200, description: 'Reset link sent successfully' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password using token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Query('token') token: string) {
    return await this.authService.resetPassword(resetPasswordDto, token)
  }

  @UseGuards(RoleGuard)
  @Roles('user')
  @Post('avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload or update user profile image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Profile image file (PNG/JPG)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profile image uploaded successfully' })
  @UseInterceptors(FileInterceptor('file', createMulterConfig('./uploads/avatars')))
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const filename = file.filename;
    await this.authService.updateProfileImage(req['userId'], filename);

    return { message: 'Profile image uploaded successfully', }
  }
}
