import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class AbandonedCartService {
  private readonly logger = new Logger(AbandonedCartService.name);

  constructor(
    @InjectQueue('abandoned-cart') private abandonedCartQueue: Queue,
    private readonly whatsappService: WhatsappService,
  ) {}

  async handleAbandonedCart(data: any) {
    this.logger.log(`🛒 سلة متروكة جديدة: ${data?.id}`);

    const phone = data?.customer?.mobile;
    const customerName = data?.customer?.first_name || 'عزيزي العميل';
    const cartTotal = data?.amounts?.total?.amount || 0;

    if (!phone) {
      this.logger.warn('⚠️ لا يوجد رقم جوال للعميل');
      return;
    }

    // إضافة للـ Queue مع تأخير 30 دقيقة
    await this.abandonedCartQueue.add(
      'send-reminder',
      {
        phone,
        customerName,
        cartTotal,
        cartId: data?.id,
        storeId: data?.store?.id,
      },
      {
        delay: 30 * 60 * 1000, // 30 دقيقة
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    );

    this.logger.log(`⏰ تم جدولة رسالة لـ ${phone} بعد 30 دقيقة`);
  }

  async sendReminderMessage(data: any) {
    const { phone, customerName, cartTotal } = data;

    const message = `مرحباً ${customerName}! 👋

لاحظنا أنك تركت سلتك بدون إكمال الطلب 🛒

سلتك تحتوي على منتجات بقيمة ${cartTotal} ريال

⚡ أكمل طلبك الآن قبل نفاد المخزون!

🎁 استخدم كود RAAD10 للحصول على خصم 10%`;

    const sent = await this.whatsappService.sendMessage(phone, message);

    if (sent) {
      this.logger.log(`✅ تم إرسال تذكير السلة لـ ${phone}`);
    } else {
      this.logger.error(`❌ فشل إرسال تذكير السلة لـ ${phone}`);
    }
  }
}