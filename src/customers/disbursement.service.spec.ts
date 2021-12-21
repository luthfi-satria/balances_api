import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { BanksService } from './banks.service';
import { CustomersService } from './customers.service';
import { DisbursementService } from './disbursement.service';
import { CustomerBalanceHistoryRepository } from './repository/customer_balance_history.repository';
import { CustomerBankRepository } from './repository/customer_bank.repository';
import { CustomerDisbursementHistoryRepository } from './repository/customer_disbursement_history.repository';

describe('DisbursementService', () => {
  let service: DisbursementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        DisbursementService,
        BanksService,
        ResponseService,
        CommonService,
        CustomersService,
        {
          provide: getRepositoryToken(CustomerDisbursementHistoryRepository),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CustomerBankRepository),
          useValue: {},
        },
        MessageService,
        {
          provide: getRepositoryToken(CustomerBalanceHistoryRepository),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DisbursementService>(DisbursementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
