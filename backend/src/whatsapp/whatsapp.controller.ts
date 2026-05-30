import { Controller, Get, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('qr')
  getQR() {
    const qr = this.whatsappService.getQRCode();
    const connected = this.whatsappService.isConnected();

    if (connected) {
      return { status: 'connected', message: '✅ واتساب متصل' };
    }

    if (!qr) {
      return { status: 'loading', message: '⏳ جاري تحميل QR...' };
    }

    return { status: 'qr', qr };
  }

  @Get('status')
  getStatus() {
    return {
      connected: this.whatsappService.isConnected(),
    };
  }

  @Post('send')
  async sendMessage(@Body() body: { phone: string; message: string }) {
    const result = await this.whatsappService.sendMessage(
      body.phone,
      body.message,
    );
    return { success: result };
  }
}