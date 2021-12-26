import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerBalanceHistoryRepository } from 'src/customers/repository/customer_balance_history.repository';
import { CustomersService } from 'src/customers/customers.service';
import { NatsController } from './nats/nats.controller';
import { NatsService } from './nats/nats.service';
import { ResponseService } from 'src/response/response.service';
import { MessageService } from 'src/message/message.service';
import { BalancesService } from 'src/balances/balances.service';
import { DisbursementService } from 'src/customers/disbursement.service';
import { BanksService } from 'src/customers/banks.service';
import { CommonService } from './common.service';
import { CustomerDisbursementHistoryRepository } from 'src/customers/repository/customer_disbursement_history.repository';
import { CustomerBankRepository } from 'src/customers/repository/customer_bank.repository';
import { HttpModule } from '@nestjs/axios';
import { SettingsService } from 'src/settings/settings.service';
import { SettingsRepository } from 'src/settings/repository/settings.repository';
import { StoresService } from 'src/stores/stores.service';
import { StoreBalanceHistoryRepository } from 'src/stores/repository/store_balance_history.repository';
import { StoreDisbursementHistoryRepository } from 'src/stores/repository/store_disbursement_history.repository';
import { MerchantService } from './merchant/merchant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerBalanceHistoryRepository,
      CustomerDisbursementHistoryRepository,
      CustomerBankRepository,
      SettingsRepository,
      StoreBalanceHistoryRepository,
      StoreDisbursementHistoryRepository,
    ]),
    HttpModule,
  ],
  controllers: [NatsController],
  providers: [
    NatsService,
    CustomersService,
    ResponseService,
    MessageService,
    BalancesService,
    DisbursementService,
    BanksService,
    CommonService,
    SettingsService,
    StoresService,
    MerchantService,
  ],
})
export class CommonModule {}
