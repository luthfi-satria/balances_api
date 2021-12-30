import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BalancesService } from './balances.service';
import { CustomerBalanceHistoryRepository } from '../customers/repository/customer_balance_history.repository';
import { CustomersService } from 'src/customers/customers.service';
import { ResponseService } from 'src/response/response.service';
import { DisbursementService } from 'src/customers/disbursement.service';
import { MessageService } from 'src/message/message.service';
import { BanksService } from 'src/customers/banks.service';
import { CommonService } from 'src/common/common.service';
import { CustomerDisbursementHistoryRepository } from 'src/customers/repository/customer_disbursement_history.repository';
import { CustomerBankRepository } from 'src/customers/repository/customer_bank.repository';
import { HttpModule } from '@nestjs/axios';
import { NatsService } from 'src/common/nats/nats.service';
import { SettingsService } from 'src/settings/settings.service';
import { SettingsRepository } from 'src/settings/repository/settings.repository';
import { StoresService } from 'src/stores/stores.service';
import { StoreBalanceHistoryRepository } from 'src/stores/repository/store_balance_history.repository';
import { StoreDisbursementHistoryRepository } from 'src/stores/repository/store_disbursement_history.repository';
import { MerchantService } from 'src/common/merchant/merchant.service';
import { BullModule } from '@nestjs/bull';
import { RedisBalanceService } from 'src/common/redis/redis-balance.service';

describe('BalancesService', () => {
  let service: BalancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        BullModule.registerQueue({
          name: 'balances',
        }),
      ],
      providers: [
        BalancesService,
        {
          provide: getRepositoryToken(CustomerBalanceHistoryRepository),
          useValue: {},
        },
        CustomersService,
        ResponseService,
        DisbursementService,
        MessageService,
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
        SettingsService,
        {
          provide: getRepositoryToken(SettingsRepository),
          useValue: {},
        },
        StoresService,
        {
          provide: getRepositoryToken(StoreBalanceHistoryRepository),
          useValue: {},
        },
        {
          provide: getRepositoryToken(StoreDisbursementHistoryRepository),
          useValue: {},
        },
        MerchantService,
        RedisBalanceService,
      ],
    }).compile();

    service = module.get<BalancesService>(BalancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
