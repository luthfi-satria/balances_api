import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { StoresService } from 'src/stores/stores.service';

@Processor('balances')
export class RedisBalanceProcessor {
  constructor(private readonly storesService: StoresService) {}
  logger = new Logger(RedisBalanceProcessor.name);

  @Process('autoDisbursementBalance')
  async handleAutoDisbursementBalance(job: Job) {
    try {
      this.logger.debug('AUTO DISBURSEMENT JOB EXECUTED. JOB: ', job.data);
      await this.storesService.storeDisbursementScheduler();
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
