 import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AbandonedCartService } from './abandoned-cart.service';

@Processor('abandoned-cart')
export class AbandonedCartProcessor extends WorkerHost {
  private readonly logger = new Logger(AbandonedCartProcessor.name);

constructor(private readonly abandonedCartService: AbandonedCartService) {
  super();
}
  async process(job: Job) {
    this.logger.log(`⚡ معالجة سلة متروكة | Job ID: ${job.id}`);
    await this.abandonedCartService.sendReminderMessage(job.data);
  }
}
