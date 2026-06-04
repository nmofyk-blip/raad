 import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PostPurchaseService } from './post-purchase.service';

@Processor('post-purchase')
export class PostPurchaseProcessor extends WorkerHost {
  private readonly logger = new Logger(PostPurchaseProcessor.name);

  constructor(private readonly postPurchaseService: PostPurchaseService) {
    super();
  }

  async process(job: Job) {
    this.logger.log(`⚡ معالجة Job: ${job.name} | ID: ${job.id}`);

    switch (job.name) {
      case 'send-review-request':
        await this.postPurchaseService.sendReviewRequest(job.data);
        break;
      case 'send-coupon':
        await this.postPurchaseService.sendCoupon(job.data);
        break;
      default:
        this.logger.warn(`⚠️ Job غير معروف: ${job.name}`);
    }
  }
}
