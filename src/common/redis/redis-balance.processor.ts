import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
// import { CancellationService } from 'src/cancellation/cancellation.service';

@Processor('balances')
export class RedisBalanceProcessor {
  // constructor() {} // private readonly cancellationService: CancellationService
  logger = new Logger(RedisBalanceProcessor.name);

  @Process('autoDisbursementBalance')
  async handleAutoDisbursementBalance(job: Job) {
    try {
      this.logger.debug('AUTO DISBURSEMENT JOB EXECUTED. ID: ', job.id);
      this.logger.debug('AUTO DISBURSEMENT JOB EXECUTED. ID: ', job.data);
      this.logger.debug('AUTO DISBURSEMENT JOB EXECUTED. ID: ', job.name);
      // await this.cancellationService.handleAutoDisbursementBalance({
      //   order_id: job.data.order_id,
      // });
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
