import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { MerchantService } from 'src/common/merchant/merchant.service';
import { NatsService } from 'src/common/nats/nats.service';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { SettingsRepository } from 'src/settings/repository/settings.repository';
import { SettingsService } from 'src/settings/settings.service';
import { StoreBalanceHistoryRepository } from 'src/stores/repository/store_balance_history.repository';
import { StoreDisbursementHistoryRepository } from 'src/stores/repository/store_disbursement_history.repository';
import { StoresService } from 'src/stores/stores.service';
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
        SettingsService,
        {
          provide: getRepositoryToken(SettingsRepository),
          useValue: {},
        },
        {
          provide: StoresService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(StoreBalanceHistoryRepository),
          useValue: {},
        },
        StoresService,
        {
          provide: getRepositoryToken(StoreDisbursementHistoryRepository),
          useValue: {},
        },
        MerchantService,
        {
          provide: NatsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BanksService>(BanksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
