import { Test, TestingModule } from "@nestjs/testing";
import { DresdenService } from "./dresden.service";

describe("DresdenService", () => {
  let service: DresdenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DresdenService],
    }).compile();

    service = module.get<DresdenService>(DresdenService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
