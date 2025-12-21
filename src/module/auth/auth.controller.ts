import { Controller, Post, Body, Res, UseGuards, UseInterceptors, UploadedFile, Req, Get } from '@nestjs/common';
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
import { resendVerificationEmailDto } from './dto/resendVerificationEmail.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register a new user
  @Post('signup')
  async signUp(@Body() signupDto: SignupDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.signUp(signupDto);
  }

  // Verify email with code and login
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyEmail(verifyEmailDto);
    return { ...result, message: 'Login successful' };
  }

  // Resend verification email
  @Post('resend-verification-email')
  async resendverificationEmail(@Body() body: resendVerificationEmailDto) {
    return await this.authService.resendVerificationEmail(body);
  }

  // Login user
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginUserDto);
    return { ...result, message: 'Login successful' };
  }

  // Send password reset email
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  // Reset password with token
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  // Upload/update profile image for authenticated users
  @UseGuards(RoleGuard)
  @Roles('user', 'admin')
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', createMulterConfig('./uploads/avatars')))
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    await this.authService.updateProfileImage(req['userId'], file.filename);
    return { message: 'Profile image uploaded successfully' };
  }

  @UseGuards(RoleGuard)
  @Roles('user', 'admin')
  @Get('me')
  async getMe(@Req() req: any) {
    return await this.authService.getMe(req?.user.id);
  }

  // @UseGuards(RoleGuard)
  // @Roles('user', 'admin')
  // @Post('updateAvatar')
  // @UseInterceptors(FileInter)
}
