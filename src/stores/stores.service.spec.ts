import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { SettingsRepository } from 'src/settings/repository/settings.repository';
import { SettingsService } from 'src/settings/settings.service';
import { StoreBalanceHistoryRepository } from './repository/store_balance_history.repository';
import { StoreDisbursementHistoryRepository } from './repository/store_disbursement_history.repository';
import { StoresService } from './stores.service';

describe('StoresService', () => {
  let service: StoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: getRepositoryToken(StoreBalanceHistoryRepository),
          useValue: {},
        },
        {
          provide: getRepositoryToken(StoreDisbursementHistoryRepository),
          useValue: {},
        },
        SettingsService,
        {
          provide: getRepositoryToken(SettingsRepository),
          useValue: {},
        },
        ResponseService,
        MessageService,
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
