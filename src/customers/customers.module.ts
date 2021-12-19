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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerBalanceHistoryRepository,
      CustomerBankRepository,
    ]),
  ],
  providers: [CustomersService, BanksService, ResponseService, MessageService],
  controllers: [CustomersController, BanksController],
})
export class CustomersModule {}
