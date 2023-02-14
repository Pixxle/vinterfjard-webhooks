import { Test, TestingModule } from '@nestjs/testing';
import { RiksarkivetService } from './riksarkivet.service';

describe('RiksarkivetService', () => {
  let service: RiksarkivetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiksarkivetService],
    }).compile();

    service = module.get<RiksarkivetService>(RiksarkivetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
