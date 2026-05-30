import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EventsService } from './events.service';
import { EventsProcessor } from './events.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'events',
    }),
  ],
  providers: [EventsService, EventsProcessor],
  exports: [EventsService],
})
export class EventsModule {}