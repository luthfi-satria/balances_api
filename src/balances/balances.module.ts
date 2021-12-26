import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalancesController } from './balances.controller';
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
  controllers: [BalancesController],
  providers: [
    BalancesService,
    CustomersService,
    ResponseService,
    DisbursementService,
    MessageService,
    BanksService,
    CommonService,
    NatsService,
    SettingsService,
    StoresService,
    MerchantService,
  ],
})
export class BalancesModule {}
