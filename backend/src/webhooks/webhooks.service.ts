import { Injectable, Logger } from '@nestjs/common';
import { EventsService } from '../events/events.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly eventsService: EventsService) {}

  async handleEvent(body: any, headers: any) {
    const event = body.event;
    const data = body.data;

    this.logger.log(`📨 استقبل حدث: ${event}`);

    await this.eventsService.addEvent(event, data);

    return { success: true, event };
  }
}