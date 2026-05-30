 import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('events')
export class EventsProcessor extends WorkerHost {
  private readonly logger = new Logger(EventsProcessor.name);

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
        await this.processOrderDelivered(data);
        break;
      case 'cart.abandoned':
        await this.processCartAbandoned(data);
        break;
      case 'customer.created':
        await this.processCustomerCreated(data);
        break;
      default:
        this.logger.warn(`⚠️ حدث غير معروف: ${event}`);
    }
  }

  private async processOrderCreated(data: any) {
    this.logger.log(`🛍️ معالجة طلب جديد: ${data?.id}`);
  }

  private async processOrderPaid(data: any) {
    this.logger.log(`💰 معالجة دفع: ${data?.id}`);
  }

  private async processOrderDelivered(data: any) {
    this.logger.log(`📦 معالجة توصيل: ${data?.id}`);
  }

  private async processCartAbandoned(data: any) {
    this.logger.log(`🛒 معالجة سلة متروكة: ${data?.id}`);
  }

  private async processCustomerCreated(data: any) {
    this.logger.log(`👤 معالجة عميل جديد: ${data?.id}`);
  }
}
