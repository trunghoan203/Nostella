import { Test, TestingModule } from '@nestjs/testing';
import { GreetingCardsController } from './greeting-cards.controller';
import { GreetingCardsService } from './greeting-cards.service';

describe('GreetingCardsController', () => {
  let controller: GreetingCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GreetingCardsController],
      providers: [GreetingCardsService],
    }).compile();

    controller = module.get<GreetingCardsController>(GreetingCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
