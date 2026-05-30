import { Injectable, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as QRCode from 'qrcode';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private client: Client;
  private qrCode: string | null = null;
  private isReady: boolean = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.client.on('qr', async (qr) => {
      this.logger.log('📱 QR Code جاهز للمسح');
      this.qrCode = await QRCode.toDataURL(qr);
    });

    this.client.on('ready', () => {
      this.logger.log('✅ واتساب متصل!');
      this.isReady = true;
      this.qrCode = null;
    });

    this.client.on('disconnected', () => {
      this.logger.warn('❌ واتساب انقطع');
      this.isReady = false;
    });

    this.client.initialize();
  }

  getQRCode(): string | null {
    return this.qrCode;
  }

  isConnected(): boolean {
    return this.isReady;
  }

  async sendMessage(phone: string, message: string): Promise<boolean> {
    try {
      if (!this.isReady) {
        this.logger.error('واتساب غير متصل');
        return false;
      }

      const formattedPhone = `966${phone.replace(/^0/, '')}@c.us`;
      await this.client.sendMessage(formattedPhone, message);
      this.logger.log(`✅ تم إرسال رسالة لـ ${phone}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ فشل إرسال رسالة: ${error.message}`);
      return false;
    }
  }
}