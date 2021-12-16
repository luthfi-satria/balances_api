import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalancesController } from './balances.controller';
import { BalancesService } from './balances.service';
import { CustomerBalanceHistoryRepository } from './repository/customer_balance_history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerBalanceHistoryRepository])],
  controllers: [BalancesController],
  providers: [BalancesService],
})
export class BalancesModule {}
