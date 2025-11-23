import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { frontOrigin } from 'src/main';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, name: string) {
    return this.mailerService.sendMail({
      to,
      subject: `🌟 ${name} عزیز، خوش آمدی به خانواده "پیدا میشه"!`,
      text: `
سلام ${name} عزیز،

خوشحالیم که به جمع دوستان "پیدا میشه" پیوستی! ❤️
اینجا هر گمشده دوباره راهش را پیدا می‌کند و هر کمکی که می‌کنی، دنیایی از لبخندها را برمی‌گرداند.

اگر چیزی گم کردی، نگران نباش — ما کنارت هستیم تا پیدایش کنی.
اگر چیزی پیدا کردی، با اشتراک گذاشتنش، شادی و امید را به دل کسی برمی‌گردانی.

با "پیدا میشه"، هیچ‌کس تنها نیست؛ ما با هم هستیم تا چیزهای گمشده دوباره به خانه‌شان بازگردند.

با بهترین آرزوها،
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

  async sendLostPostPendingApprovalEmail(to: string, title: string) {
    return this.mailerService.sendMail({
      to,
      subject: 'آگهی شما ثبت شد و در حال بررسی است ✍️',
      html: `
      <div style="font-family: sans-serif; line-height: 1.6; direction: rtl;">
        <p>سلام 👋</p>
        <p>
          آگهی <strong>"${title}"</strong> با موفقیت ثبت شد و اکنون در صف بررسی توسط تیم مدیریت قرار دارد.
        </p>
        <p>به محض تایید، از طریق ایمیل اطلاع‌رسانی خواهد شد.</p>
        <p>
          می‌دانیم گم کردن چیزی تجربه سختی است، اما امیدواریم خیلی زود خبرهای خوب برسد و دوباره به دستتان بازگردد. 🌹
        </p>
      </div>
    `,
    });
  }

  async sendFoundPostPendingApprovalEmail(to: string, title: string) {
    return this.mailerService.sendMail({
      to,
      subject: 'آگهی شما ثبت و در انتظار تایید است 🤝',
      html: `
      <div style="font-family: sans-serif; line-height: 1.6; direction: rtl;">
        <p>سلام 👋</p>
        <p>
          آگهی <strong>"${title}"</strong> با موفقیت ثبت شد و پس از تایید مدیریت در سایت نمایش داده می‌شود.
        </p>
        <p>به محض تایید، از طریق ایمیل به شما اطلاع داده خواهد شد.</p>
        <p>
          از اینکه برای شادی و آرامش یک صاحب اشیای گمشده قدمی برداشتید، قدردان هستیم. 🌟
          این حرکت شما می‌تواند لبخند بزرگی به زندگی کسی برگرداند.
        </p>
      </div>
    `,
    });
  }

  async sendLostPostOwnerClaimEmail(to: string, postTitle: string) {
    return this.mailerService.sendMail({
      to,
      subject: 'یک نفر ادعا کرده کالای گمشده شما را پیدا کرده 🔔',
      html: `
      <div style="font-family: sans-serif; line-height: 1.6; direction: rtl;">
        <p>سلام 👋</p>
        <p>
          برای آگهی <strong>"${postTitle}"</strong> یک درخواست مالکیت ثبت شده است.
        </p>
        <p>
          یعنی یک نفر گفته که کالای گمشده شما را پیدا کرده، و منتظر تایید شماست.
        </p>
        <p>
          امیدواریم این خبر قدمی باشد برای پایان نگرانی و رسیدن وسیله‌تان به شما 🌹
        </p>
      </div>
    `,
    });
  }

  async sendFoundPostOwnerClaimEmail(to: string, postTitle: string) {
    return this.mailerService.sendMail({
      to,
      subject: 'یک نفر ادعا کرده صاحب کالای پیدا شده است 🔔',
      html: `
      <div style="font-family: sans-serif; line-height: 1.6; direction: rtl;">
        <p>سلام 👋</p>
        <p>
          برای آگهی <strong>"${postTitle}"</strong> یک درخواست مالکیت ثبت شده است.
        </p>
        <p>
          یعنی یک نفر گفته که صاحب وسیله‌ای است که شما پیدا و ثبت کرده‌اید.
        </p>
        <p>
          از اینکه قدمی برای بازگشت آرامش و لبخند به زندگی کسی برداشتید، ممنونیم 🌟
        </p>
      </div>
    `,
    });
  }
}
