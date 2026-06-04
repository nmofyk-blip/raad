import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AbandonedCartService } from './abandoned-cart.service';
import { AbandonedCartProcessor } from './abandoned-cart.processor';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'abandoned-cart',
    }),
    WhatsappModule,
  ],
  providers: [AbandonedCartService, AbandonedCartProcessor],
  exports: [AbandonedCartService],
})
export class AbandonedCartModule {}