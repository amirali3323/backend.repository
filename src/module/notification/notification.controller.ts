import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('api/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {

  }
}
