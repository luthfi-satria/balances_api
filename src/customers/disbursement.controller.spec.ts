import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { BanksService } from './banks.service';
import { CustomersService } from './customers.service';
import { DisbursementController } from './disbursement.controller';
import { DisbursementService } from './disbursement.service';
import { CustomerBalanceHistoryRepository } from './repository/customer_balance_history.repository';
import { CustomerBankRepository } from './repository/customer_bank.repository';
import { CustomerDisbursementHistoryRepository } from './repository/customer_disbursement_history.repository';

describe('DisbursementController', () => {
  let controller: DisbursementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [DisbursementController],
      providers: [
        MessageService,
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
        {
          provide: getRepositoryToken(CustomerBalanceHistoryRepository),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<DisbursementController>(DisbursementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
