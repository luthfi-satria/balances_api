import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BalancesService } from 'src/balances/balances.service';
import { BanksService } from 'src/customers/banks.service';
import { CustomersService } from 'src/customers/customers.service';
import { DisbursementService } from 'src/customers/disbursement.service';
import { CustomerBankRepository } from 'src/customers/repository/customer_bank.repository';
import { CustomerDisbursementHistoryRepository } from 'src/customers/repository/customer_disbursement_history.repository';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { CommonService } from '../common.service';
import { NatsController } from './nats.controller';

describe('NatsController', () => {
  let controller: NatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [NatsController],
      providers: [
        {
          provide: CustomersService,
          useValue: {},
        },
        MessageService,
        BalancesService,
        ResponseService,
        DisbursementService,
        BanksService,
        CommonService,
        {
          provide: getRepositoryToken(CustomerDisbursementHistoryRepository),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CustomerBankRepository),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<NatsController>(NatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
