import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerBalanceHistoryRepository } from 'src/customers/repository/customer_balance_history.repository';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';
import { CustomerBankRepository } from './repository/customer_bank.repository';
import { ResponseService } from 'src/response/response.service';
import { MessageService } from 'src/message/message.service';
import { DisbursementController } from './disbursement.controller';
import { DisbursementService } from './disbursement.service';
import { CommonService } from 'src/common/common.service';
import { HttpModule } from '@nestjs/axios';
import { CustomerDisbursementHistoryRepository } from './repository/customer_disbursement_history.repository';
import { NatsService } from 'src/common/nats/nats.service';
import { SettingsService } from 'src/settings/settings.service';
import { SettingsRepository } from 'src/settings/repository/settings.repository';
import { StoresService } from 'src/stores/stores.service';
import { StoreBalanceHistoryRepository } from 'src/stores/repository/store_balance_history.repository';
import { StoreDisbursementHistoryRepository } from 'src/stores/repository/store_disbursement_history.repository';
import { MerchantService } from 'src/common/merchant/merchant.service';
import { RedisBalanceService } from 'src/common/redis/redis-balance.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerBalanceHistoryRepository,
      CustomerBankRepository,
      CustomerDisbursementHistoryRepository,
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
    CustomersService,
    BanksService,
    ResponseService,
    MessageService,
    DisbursementService,
    CommonService,
    NatsService,
    SettingsService,
    StoresService,
    MerchantService,
    RedisBalanceService,
  ],
  controllers: [CustomersController, BanksController, DisbursementController],
})
export class CustomersModule {}
