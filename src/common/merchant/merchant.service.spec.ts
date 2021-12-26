import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { MerchantService } from './merchant.service';

describe('MerchantService', () => {
  let service: MerchantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [MerchantService, ResponseService, MessageService],
    }).compile();

    service = module.get<MerchantService>(MerchantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
