import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { frontOrigin } from 'src/main';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendWelcomeEmail(to: string, name: string) {
    return this.mailerService.sendMail({
      to,
      subject: `🌟 ${name} عزیز، به "پیدا میشه" خوش آمدی!`,
      text: `
سلام ${name} عزیز،

به "پیدا میشه" خوش آمدی! اینجا، گمشده‌ها دوباره راهشان را پیدا می‌کنند.

اگر چیزی گم کردی، نگران نباش — ما کمکت می‌کنیم پیدایش کنی.
اگر چیزی پیدا کردی، با اشتراک گذاشتن آن شاید شادی را به دل کسی برگردانی ❤️

تیم "پیدا میشه"
      `,
    });
  }

  async sendEmailVerification(to: string, code: string) {
    return this.mailerService.sendMail({
      to,
      subject: 'کد تایید ایمیل شما ✅',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; direction: rtl;">
          <p>سلام 👋</p>
          <p>کد تایید ایمیل شما:</p>
          <h2 style="color:#007bff; letter-spacing: 2px;">${code}</h2>
          <p>این کد تا ۱۰ دقیقه آینده معتبر است.</p>
        </div>
      `,
    });
  }

  async sendForgetPasswordEmail(to: string, token: string) {
    console.log(token)
    const url = new URL(`/auth/reset-password?token=${token}`, frontOrigin).toString();
    return this.mailerService.sendMail({
      to,
      subject: 'بازنشانی رمز عبور 🔑',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; direction: rtl;">
          <p>برای بازنشانی رمز عبور، روی لینک زیر کلیک کنید:</p>
          <a href="${url}">${url}</a>
          <p>این لینک تا ۱۰ دقیقه معتبر است.</p>
        </div>
      `,
    });
  }
}
