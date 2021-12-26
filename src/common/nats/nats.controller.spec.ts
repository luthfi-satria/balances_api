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
import { SettingsRepository } from 'src/settings/repository/settings.repository';
import { SettingsService } from 'src/settings/settings.service';
import { StoreBalanceHistoryRepository } from 'src/stores/repository/store_balance_history.repository';
import { StoreDisbursementHistoryRepository } from 'src/stores/repository/store_disbursement_history.repository';
import { StoresService } from 'src/stores/stores.service';
import { CommonService } from '../common.service';
import { MerchantService } from '../merchant/merchant.service';
import { NatsController } from './nats.controller';
import { NatsService } from './nats.service';

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
        {
          provide: NatsService,
          useValue: {},
        },
        StoresService,
        {
          provide: getRepositoryToken(StoreBalanceHistoryRepository),
          useValue: {},
        },
        SettingsService,
        {
          provide: getRepositoryToken(StoreDisbursementHistoryRepository),
          useValue: {},
        },
        {
          provide: getRepositoryToken(SettingsRepository),
          useValue: {},
        },
        MerchantService,
      ],
    }).compile();

    controller = module.get<NatsController>(NatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
