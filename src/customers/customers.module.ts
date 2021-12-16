import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerBalanceHistoryRepository } from 'src/balances/repository/customer_balance_history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerBalanceHistoryRepository])],
  providers: [CustomersService],
  controllers: [CustomersController],
})
export class CustomersModule {}
