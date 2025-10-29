import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) { }

  async getHello(): Promise<string> {
    return await this.mailerService.sendMail({
      to: 'mobina.mahdi2014@gmail.com', // ایمیل مقصد
      subject: 'Test Email ✔', // موضوع ایمیل
      text: 'This is a test email',
    });
  }
}
