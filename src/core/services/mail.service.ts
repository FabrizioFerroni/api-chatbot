import { configApp } from '@/config/app/config.app';
import { MessageQueue } from '@/shared/types/message-mail.type';
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name, { timestamp: true });

  constructor(private readonly httpService: HttpService) {}

  async sendMail(queue: string, body: MessageQueue) {
    if (!configApp().mailServiceUrl) {
      this.logger.error('Mail service url not set');
      throw new InternalServerErrorException('Internal Server Error');
    }

    const url: string = `${configApp().mailServiceUrl}/email/${configApp().exchange}/${queue}`;

    body.color = configApp().appColor;
    body.emailFrom = configApp().appEmailFrom;
    body.urlApp = configApp().appHost;
    body.mailApp = configApp().appMail;
    body.imgApp = configApp().appImg;

    const { data } = await firstValueFrom(this.httpService.post(url, body));

    return data;
  }
}
