import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { BanksService } from './banks.service';
import { CustomerBankRepository } from './repository/customer_bank.repository';

describe('BanksService', () => {
  let service: BanksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        BanksService,
        MessageService,
        {
          provide: getRepositoryToken(CustomerBankRepository),
          useValue: {},
        },
        ResponseService,
        CommonService,
      ],
    }).compile();

    service = module.get<BanksService>(BanksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
