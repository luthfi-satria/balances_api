import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from 'src/response/response.service';
import { MessageService } from 'src/message/message.service';
import { SettingsRepository } from './repository/settings.repository';
import { StoresService } from 'src/stores/stores.service';
import { StoreBalanceHistoryRepository } from 'src/stores/repository/store_balance_history.repository';
import { StoreDisbursementHistoryRepository } from 'src/stores/repository/store_disbursement_history.repository';
import { CommonService } from 'src/common/common.service';
import { MerchantService } from 'src/common/merchant/merchant.service';
import { NatsService } from 'src/common/nats/nats.service';
import { RedisBalanceService } from 'src/common/redis/redis-balance.service';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull/dist/bull.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SettingsRepository,
      StoreBalanceHistoryRepository,
      StoreDisbursementHistoryRepository,
    ]),
    HttpModule,
    BullModule.registerQueue({
      name: 'balances',
    }),
  ],
  providers: [
    SettingsService,
    ResponseService,
    MessageService,
    StoresService,
    CommonService,
    MerchantService,
    NatsService,
    RedisBalanceService,
  ],
  controllers: [SettingsController],
})
export class SettingsModule {}
