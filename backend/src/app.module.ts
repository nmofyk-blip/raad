import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoresModule } from './stores/stores.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { EventsModule } from './events/events.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { MessagesModule } from './messages/messages.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { AbandonedCartModule } from './abandoned-cart/abandoned-cart.module';
import { PostPurchaseModule } from './post-purchase/post-purchase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') ?? '5432'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: parseInt(configService.get('REDIS_PORT') ?? '6379'),
        },
      }),
      inject: [ConfigService],
    }),
    StoresModule,
    WebhooksModule,
    EventsModule,
    CustomersModule,
    OrdersModule,
    MessagesModule,
    WhatsappModule,
    AbandonedCartModule,
    PostPurchaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}