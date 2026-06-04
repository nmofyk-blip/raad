import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EventsService } from './events.service';
import { EventsProcessor } from './events.processor';
import { AbandonedCartModule } from '../abandoned-cart/abandoned-cart.module';
import { PostPurchaseModule } from '../post-purchase/post-purchase.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'events',
    }),
    AbandonedCartModule,
    PostPurchaseModule,
  ],
  providers: [EventsService, EventsProcessor],
  exports: [EventsService],
})
export class EventsModule {}