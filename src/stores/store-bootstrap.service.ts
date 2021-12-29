import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { StoresService } from './stores.service';

@Injectable()
export class StoreBootstrap implements OnApplicationBootstrap {
  constructor(
    private readonly logger: Logger,
    private readonly storesService: StoresService,
  ) {}
  onApplicationBootstrap() {
    this.createAutoDisbursementBalanceJob();
  }
  async createAutoDisbursementBalanceJob() {
    await this.storesService.createAutoDisbursement();
  }
}
