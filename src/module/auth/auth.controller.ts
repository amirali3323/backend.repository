import { Controller, Get, Post, Body, Delete, Res, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import type { Response } from 'express';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signUp(@Body() signupDto: SignupDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.signUp(signupDto);
  }

  @Post('verify-email')
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
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Query('token') token: string) {
    return await this.authService.resetPassword(resetPasswordDto, token)
  }
}
