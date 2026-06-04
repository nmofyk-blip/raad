import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AbandonedCartService } from '../abandoned-cart/abandoned-cart.service';
import { PostPurchaseService } from '../post-purchase/post-purchase.service';

@Processor('events')
export class EventsProcessor extends WorkerHost {
  private readonly logger = new Logger(EventsProcessor.name);

  constructor(
    private readonly abandonedCartService: AbandonedCartService,
    private readonly postPurchaseService: PostPurchaseService,
  ) {
    super();
  }

  async process(job: Job) {
    const { event, data } = job.data;
    this.logger.log(`⚡ معالجة حدث: ${event} | Job ID: ${job.id}`);

    switch (event) {
      case 'order.created':
        await this.processOrderCreated(data);
        break;
      case 'order.paid':
        await this.processOrderPaid(data);
        break;
      case 'order.delivered':
        await this.postPurchaseService.handleOrderDelivered(data);
        break;
      case 'cart.abandoned':
        await this.abandonedCartService.handleAbandonedCart(data);
        break;
      case 'customer.created':
        await this.processCustomerCreated(data);
        break;
      default:
        this.logger.warn(`⚠️ حدث غير معروف: ${event}`);
    }
  }

  private async processOrderCreated(data: any) {
    this.logger.log(`🛍️ طلب جديد: ${data?.id}`);
  }

  private async processOrderPaid(data: any) {
    this.logger.log(`💰 تم الدفع: ${data?.id}`);
  }

  private async processCustomerCreated(data: any) {
    this.logger.log(`👤 عميل جديد: ${data?.id}`);
  }
}