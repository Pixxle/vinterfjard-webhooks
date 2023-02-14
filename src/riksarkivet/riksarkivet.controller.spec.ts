import { Test, TestingModule } from '@nestjs/testing';
import { RiksarkivetController } from './riksarkivet.controller';

describe('RiksarkivetController', () => {
  let controller: RiksarkivetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiksarkivetController],
    }).compile();

    controller = module.get<RiksarkivetController>(RiksarkivetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
