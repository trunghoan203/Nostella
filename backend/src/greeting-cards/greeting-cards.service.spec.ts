import { Test, TestingModule } from '@nestjs/testing';
import { GreetingCardsService } from './greeting-cards.service';

describe('GreetingCardsService', () => {
  let service: GreetingCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GreetingCardsService],
    }).compile();

    service = module.get<GreetingCardsService>(GreetingCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
