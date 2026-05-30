import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('salla')
  @HttpCode(HttpStatus.OK)
  async handleSallaWebhook(
    @Body() body: any,
    @Headers() headers: any,
  ) {
    return this.webhooksService.handleEvent(body, headers);
  }
}