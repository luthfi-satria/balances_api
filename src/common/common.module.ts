import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerBalanceHistoryRepository } from 'src/balances/repository/customer_balance_history.repository';
import { CustomersService } from 'src/customers/customers.service';
import { NatsController } from './nats/nats.controller';
import { NatsService } from './nats/nats.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerBalanceHistoryRepository])],
  controllers: [NatsController],
  providers: [NatsService, CustomersService],
})
export class CommonModule {}
