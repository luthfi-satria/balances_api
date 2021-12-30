import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { MerchantService } from 'src/common/merchant/merchant.service';
import { NatsService } from 'src/common/nats/nats.service';
import { RedisBalanceService } from 'src/common/redis/redis-balance.service';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { SettingsRepository } from 'src/settings/repository/settings.repository';
import { SettingsService } from 'src/settings/settings.service';
import { StoreBalanceHistoryRepository } from 'src/stores/repository/store_balance_history.repository';
import { StoreDisbursementHistoryRepository } from 'src/stores/repository/store_disbursement_history.repository';
import { StoresService } from 'src/stores/stores.service';
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
      imports: [
        HttpModule,
        BullModule.registerQueue({
          name: 'balances',
        }),
      ],
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
        RedisBalanceService,
        {
          provide: getRepositoryToken(StoreBalanceHistoryRepository),
          useValue: {},
        },
        {
          provide: getRepositoryToken(StoreDisbursementHistoryRepository),
          useValue: {},
        },
        MerchantService,
      ],
    }).compile();

    service = module.get<DisbursementService>(DisbursementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
