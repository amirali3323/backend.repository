import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostType } from 'src/common/enums';
import { MailService } from 'src/common/services/mail.service';
import { AuthService } from 'src/module/auth/auth.service';

@Injectable()
export class PostCreatedListener {
  constructor(
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  /** Send email to user when a post is created (pending approval) */
  @OnEvent('post.created')
  async handlePostCreated(event: { userId: number; type: PostType; title: string }) {
    const email = await this.authService.getEmail(event.userId);
    if (!email) return;

    if (event.type === PostType.LOST) {
      await this.mailService.sendLostPostPendingApprovalEmail(email, event.title);
    } else {
      await this.mailService.sendFoundPostPendingApprovalEmail(email, event.title);
    }
  }
}
