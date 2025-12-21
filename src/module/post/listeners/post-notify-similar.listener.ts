import { Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Post } from '../entities/post.entity';
import { MailService } from 'src/common/services/mail.service';

@Injectable()
export class PostNotifySimilarListener {
  constructor(
    private readonly postService: PostService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Handle post.notify-similar event
   * @description Sends emails to owners of similar posts to notify them about a new related post
   */
  @OnEvent('post.notify-similar')
  async handleNotifySimilar(event: { post: Post; districtIds: number[] }) {
    const { post, districtIds } = event;

    const similarPosts = await this.postService.findSimilarPosts(post, districtIds);

    await Promise.all(
      similarPosts.map((similar) => {
        const email = similar.owner?.email;
        if (!email) return;

        return this.mailService.sendSimilarPostEmail(email, post.title, similar.type, similar.title, post.id);
      }),
    );
  }
}
