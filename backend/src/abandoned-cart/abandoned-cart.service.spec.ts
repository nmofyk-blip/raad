import { Test, TestingModule } from '@nestjs/testing';
import { AbandonedCartService } from './abandoned-cart.service';

describe('AbandonedCartService', () => {
  let service: AbandonedCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbandonedCartService],
    }).compile();

    service = module.get<AbandonedCartService>(AbandonedCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
