import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerBalanceHistoryRepository } from 'src/customers/repository/customer_balance_history.repository';
import { CustomersService } from 'src/customers/customers.service';
import { NatsController } from './nats/nats.controller';
import { NatsService } from './nats/nats.service';
import { ResponseService } from 'src/response/response.service';
import { MessageService } from 'src/message/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerBalanceHistoryRepository])],
  controllers: [NatsController],
  providers: [NatsService, CustomersService, ResponseService, MessageService],
})
export class CommonModule {}
