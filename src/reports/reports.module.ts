import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { StoreBalanceHistoryRepository } from 'src/stores/repository/store_balance_history.repository';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { StoreBalanceReportRepository } from './repository/store_reports.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      StoreBalanceHistoryRepository,
      StoreBalanceReportRepository,
    ]),
    HttpModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ResponseService, MessageService, Logger],
  exports: [TypeOrmModule, ReportsService],
})
export class ReportsModule {}
