import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class PostPurchaseService {
  private readonly logger = new Logger(PostPurchaseService.name);

  constructor(
    @InjectQueue('post-purchase') private postPurchaseQueue: Queue,
    private readonly whatsappService: WhatsappService,
  ) {}

  async handleOrderDelivered(data: any) {
    this.logger.log(`📦 طلب تم تسليمه: ${data?.id}`);

    const phone = data?.customer?.mobile;
    const customerName = data?.customer?.first_name || 'عزيزي العميل';
    const orderNumber = data?.reference_id || data?.id;

    if (!phone) {
      this.logger.warn('⚠️ لا يوجد رقم جوال للعميل');
      return;
    }

    // إرسال رسالة تقييم بعد ساعة
    await this.postPurchaseQueue.add(
      'send-review-request',
      {
        phone,
        customerName,
        orderNumber,
        type: 'review',
      },
      {
        delay: 60 * 60 * 1000, // ساعة واحدة
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    );

    this.logger.log(`⏰ تم جدولة رسالة تقييم لـ ${phone} بعد ساعة`);
  }

  async sendReviewRequest(data: any) {
    const { phone, customerName, orderNumber } = data;

    const message = `مرحباً ${customerName}! 😊

نأمل أنك استلمت طلبك رقم #${orderNumber} بشكل سليم 📦

رأيك يهمنا كثيراً! هل يمكنك تقييم تجربتك معنا؟ ⭐

تقييمك يساعدنا على تحسين خدمتنا لك وللعملاء الآخرين 🙏

شكراً لثقتك بنا! 💙`;

    const sent = await this.whatsappService.sendMessage(phone, message);

    if (sent) {
      this.logger.log(`✅ تم إرسال طلب تقييم لـ ${phone}`);

      // إرسال كوبون خصم بعد 10 دقائق
      await this.postPurchaseQueue.add(
        'send-coupon',
        {
          phone,
          customerName,
          type: 'coupon',
        },
        {
          delay: 10 * 60 * 1000, // 10 دقائق
          attempts: 3,
        },
      );
    }
  }

  async sendCoupon(data: any) {
    const { phone, customerName } = data;

    const message = `شكراً ${customerName} على تقييمك! 🌟

هدية خاصة لك من رعد 🎁

استخدم كود: THANKS15
للحصول على خصم 15% على طلبك القادم

صالح لمدة 7 أيام ⏰`;

    const sent = await this.whatsappService.sendMessage(phone, message);

    if (sent) {
      this.logger.log(`✅ تم إرسال كوبون لـ ${phone}`);
    }
  }
}