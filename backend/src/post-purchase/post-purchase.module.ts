import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PostPurchaseService } from './post-purchase.service';
import { PostPurchaseProcessor } from './post-purchase.processor';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'post-purchase',
    }),
    WhatsappModule,
  ],
  providers: [PostPurchaseService, PostPurchaseProcessor],
  exports: [PostPurchaseService],
})
export class PostPurchaseModule {}