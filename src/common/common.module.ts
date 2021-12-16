import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalancesService } from 'src/balances/balances.service';
import { CustomerBalanceHistoryRepository } from 'src/balances/repository/customer_balance_history.repository';
import { NatsController } from './nats/nats.controller';
import { NatsService } from './nats/nats.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerBalanceHistoryRepository])],
  controllers: [NatsController],
  providers: [NatsService, BalancesService],
})
export class CommonModule {}
