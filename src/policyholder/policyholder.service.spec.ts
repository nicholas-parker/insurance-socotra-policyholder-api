import { Test, TestingModule } from '@nestjs/testing';
import { PolicyholderService } from './policyholder.service';

describe('PolicyholderService', () => {
  let service: PolicyholderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PolicyholderService],
    }).compile();

    service = module.get<PolicyholderService>(PolicyholderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve a policyholder', async () => {
    jest.setTimeout(30000);
    const locator = '123';
    const ph = await service.getPolicyholder(locator);
    console.log(ph);
  });
});
