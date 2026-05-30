import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectQueue('events') private eventsQueue: Queue,
  ) {}

  async addEvent(event: string, data: any) {
    this.logger.log(`📥 إضافة حدث للطابور: ${event}`);
    await this.eventsQueue.add(event, {
      event,
      data,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}