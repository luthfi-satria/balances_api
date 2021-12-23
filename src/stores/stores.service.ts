import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { SettingsService } from 'src/settings/settings.service';
import {
  StoreBalanceHistoryDocument,
  StoreTransactionStatus,
  StoreTransactionType,
} from './entities/store_balance_history.entity';
import { StoreDisbursementHistoryDocument } from './entities/store_disbursement_history.entity';
import { StoreBalanceHistoryRepository } from './repository/store_balance_history.repository';
import { StoreDisbursementHistoryRepository } from './repository/store_disbursement_history.repository';

@Injectable()
export class StoresService {
  constructor(
    private readonly storeBalanceHistoryRepository: StoreBalanceHistoryRepository,
    private readonly settingsService: SettingsService,
    private readonly storeDisbursementHistory: StoreDisbursementHistoryRepository,
  ) {}

  async saveOrderComplete(data: any) {
    let totalStore = 0;
    if (data.total_store) totalStore = data.total_store;

    const eligibleDisbursementAtSetting =
      await this.settingsService.getSettingsByNames(['eligible_disburse_at']);
    const eligibleDisbursementAt = eligibleDisbursementAtSetting[0].value;
    let eligibleAt = null;

    if (eligibleDisbursementAt == 'INSTANTLY') {
      eligibleAt = data.transaction_date;
    } else if (eligibleDisbursementAt.substring(0, 7) == 'D_PLUS_') {
      eligibleAt = moment(data.transaction_date).add(
        eligibleDisbursementAt.substring(7),
        'days',
      );
    }

    const storeBalanceHistoryData: Partial<StoreBalanceHistoryDocument> = {
      order_id: data.id,
      group_id: data.group_id,
      merchant_id: data.merchant_id,
      store_id: data.store_id,
      type: StoreTransactionType.REFUND,
      amount: totalStore,
      status: StoreTransactionStatus.SUCCESS,
      recorded_at: data.transaction_date,
      eligible_at: eligibleAt,
    };
    this.storeBalanceHistoryRepository.save(storeBalanceHistoryData);
  }

  async findStoreBalanceByCriteria(data: Record<string, any>) {
    return this.storeBalanceHistoryRepository.findOne({ where: data });
  }

  async saveStoreBalanceHistory(
    data: Partial<StoreBalanceHistoryDocument>,
  ): Promise<StoreBalanceHistoryDocument> {
    return this.storeBalanceHistoryRepository.save(data);
  }

  async saveStoreDisbursementHistory(
    data: Partial<StoreDisbursementHistoryDocument>,
  ): Promise<StoreDisbursementHistoryDocument> {
    return this.storeDisbursementHistory.save(data);
  }
}
