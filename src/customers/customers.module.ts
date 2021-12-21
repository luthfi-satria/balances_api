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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerBalanceHistoryRepository,
      CustomerBankRepository,
      CustomerDisbursementHistoryRepository,
    ]),
    HttpModule,
  ],
  providers: [
    CustomersService,
    BanksService,
    ResponseService,
    MessageService,
    DisbursementService,
    CommonService,
  ],
  controllers: [CustomersController, BanksController, DisbursementController],
})
export class CustomersModule {}
