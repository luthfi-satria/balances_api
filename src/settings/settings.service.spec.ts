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
import { StoreBalanceHistoryRepository } from 'src/stores/repository/store_balance_history.repository';
import { StoreDisbursementHistoryRepository } from 'src/stores/repository/store_disbursement_history.repository';
import { StoresService } from 'src/stores/stores.service';
import { SettingsRepository } from './repository/settings.repository';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        BullModule.registerQueue({
          name: 'balances',
        }),
      ],
      providers: [
        SettingsService,
        ResponseService,
        MessageService,
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
        CommonService,
        MerchantService,
        {
          provide: getRepositoryToken(SettingsRepository),
          useValue: {},
        },
        {
          provide: NatsService,
          useValue: {},
        },
        RedisBalanceService,
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
