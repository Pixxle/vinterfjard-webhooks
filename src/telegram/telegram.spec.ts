import { Test, TestingModule } from '@nestjs/testing';
import { Telegram } from './telegram';

describe('Telegram', () => {
  let provider: Telegram;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Telegram],
    }).compile();

    provider = module.get<Telegram>(Telegram);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
