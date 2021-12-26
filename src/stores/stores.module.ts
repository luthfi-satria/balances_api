import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { SettingsRepository } from 'src/settings/repository/settings.repository';
import { SettingsService } from 'src/settings/settings.service';
import { StoreBalanceHistoryRepository } from './repository/store_balance_history.repository';
import { StoreDisbursementHistoryRepository } from './repository/store_disbursement_history.repository';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { CommonService } from 'src/common/common.service';
import { MerchantService } from 'src/common/merchant/merchant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreBalanceHistoryRepository,
      StoreDisbursementHistoryRepository,
      SettingsRepository,
    ]),
    HttpModule,
  ],
  providers: [
    StoresService,
    SettingsService,
    ResponseService,
    MessageService,
    CommonService,
    MerchantService,
  ],
  controllers: [StoresController],
})
export class StoresModule {}
