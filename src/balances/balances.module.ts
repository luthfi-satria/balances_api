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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerBalanceHistoryRepository,
      CustomerDisbursementHistoryRepository,
      CustomerBankRepository,
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
  ],
})
export class BalancesModule {}
