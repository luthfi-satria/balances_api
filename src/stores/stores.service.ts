import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { CommonService } from 'src/common/common.service';
import { ListResponse } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { SettingsService } from 'src/settings/settings.service';
import {
  ListStoresBalancesDto,
  ListStoresDto,
  StoreDisbursementDto,
} from './dto/stores_balance.dto';
import {
  StoreBalanceHistoryDocument,
  StoreTransactionStatus,
  StoreTransactionType,
} from './entities/store_balance_history.entity';
import {
  StoreDisbursementHistoryDocument,
  StoreDisbursementTransactionStatus,
} from './entities/store_disbursement_history.entity';
import { StoreBalanceHistoryRepository } from './repository/store_balance_history.repository';
import { StoreDisbursementHistoryRepository } from './repository/store_disbursement_history.repository';
import _ from 'lodash';
import { MerchantService } from 'src/common/merchant/merchant.service';
import { NatsService } from 'src/common/nats/nats.service';

@Injectable()
export class StoresService {
  constructor(
    private readonly storeBalanceHistoryRepository: StoreBalanceHistoryRepository,
    private readonly settingsService: SettingsService,
    private readonly storeDisbursementHistory: StoreDisbursementHistoryRepository,
    private readonly responseService: ResponseService,
    private readonly commonService: CommonService,
    private readonly merchantService: MerchantService,
    private readonly natsService: NatsService,
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
      type: StoreTransactionType.BALANCE,
      amount: totalStore,
      status: StoreTransactionStatus.SUCCESS,
      recorded_at: data.transaction_date,
      eligible_at: eligibleAt,
    };
    this.storeBalanceHistoryRepository.save(storeBalanceHistoryData);
  }

  async listStoresBalanceHistories(
    data: ListStoresBalancesDto,
    user: any,
  ): Promise<ListResponse> {
    const storeBalances = await this.storeBalanceHistoryRepository
      .findListStoresBalanceHistories(data, user)
      .catch(async () => {
        throw await this.responseService.httpExceptionHandling(
          '',
          '',
          'general.general.dataNotFound',
          404,
        );
      });
    if (!storeBalances) {
      throw await this.responseService.httpExceptionHandling(
        '',
        '',
        'general.general.dataNotFound',
        404,
      );
    }
    const listDisbursementMethod = [];
    const listStore = [];
    for (const storeBalance of storeBalances.items) {
      await this.maskingAccountNameNumber(
        storeBalance,
        'store_balance_history',
      );
      const idx = _.findIndex(listDisbursementMethod, function (ix: any) {
        return ix.id == storeBalance.disbursement_method_id;
      });
      if (idx == -1) {
        const url = `${process.env.BASEURL_PAYMENTS_SERVICE}/api/v1/payments/internal/disbursement_method/${storeBalance.disbursement_method_id}`;
        const disbursementMethod = await this.commonService.getHttp(url);
        if (disbursementMethod) {
          storeBalance.disbursement_method = disbursementMethod;
          listDisbursementMethod.push(disbursementMethod);
        } else {
          storeBalance.disbursement_method = null;
        }
      } else {
        storeBalance.disbursement_method = listDisbursementMethod[idx];
      }

      const idy = _.findIndex(listStore, function (ix: any) {
        return ix.id == storeBalance.store_id;
      });
      if (idy == -1) {
        const store = await this.merchantService.getStore(
          storeBalance.store_id,
        );
        if (store) {
          await this.maskingAccountNameNumber(store, 'store');
          storeBalance.store = store;
          listStore.push(store);
        }
      } else {
        storeBalance.store = listStore[idy];
      }
    }

    return storeBalances;
  }

  async maskingAccountNameNumber(storeBalance: any, typedata: string) {
    if (typedata == 'store_balance_history') {
      if (storeBalance.account_name) {
        const arrAccName = storeBalance.account_name.split(' ');
        let maskName = '';
        for (const subName of arrAccName) {
          maskName += `${subName.substring(0, 1)}${subName
            .substring(1)
            .replace(/./g, '*')} `;
        }
        storeBalance.account_name = maskName.substring(0, maskName.length - 1);
      }
      if (storeBalance.account_no) {
        storeBalance.account_no = `${storeBalance.account_no.substring(
          0,
          3,
        )}${storeBalance.account_no.substring(3).replace(/./g, '*')}`;
      }
    } else {
      if (storeBalance.bank_account_name) {
        const arrAccName = storeBalance.bank_account_name.split(' ');
        let maskName = '';
        for (const subName of arrAccName) {
          maskName += `${subName.substring(0, 1)}${subName
            .substring(1)
            .replace(/./g, '*')} `;
        }
        storeBalance.bank_account_name = maskName.substring(
          0,
          maskName.length - 1,
        );
      }
      if (storeBalance.bank_account_no) {
        storeBalance.bank_account_no = `${storeBalance.bank_account_no.substring(
          0,
          3,
        )}${storeBalance.bank_account_no.substring(3).replace(/./g, '*')}`;
      }
    }
  }

  async detailStoresBalanceHistories(
    store_history_id: string,
    user: any,
  ): Promise<StoreBalanceHistoryDocument> {
    const storeBalance = await this.storeBalanceHistoryRepository
      .findOne(store_history_id, user)
      .catch(async (err) => {
        console.error(err);
        throw await this.responseService.httpExceptionHandling(
          '',
          '',
          'general.general.dataNotFound',
          404,
        );
      });
    if (!storeBalance) {
      throw await this.responseService.httpExceptionHandling(
        '',
        '',
        'general.general.dataNotFound',
        404,
      );
    }
    await this.maskingAccountNameNumber(storeBalance, 'store_balance_history');

    const store = await this.merchantService.merchantValidation(
      storeBalance.store_id,
      user,
    );
    await this.maskingAccountNameNumber(store, 'store');
    const url = `${process.env.BASEURL_PAYMENTS_SERVICE}/api/v1/payments/internal/disbursement_method/${storeBalance.disbursement_method_id}`;
    const disbursementMethod = await this.commonService.getHttp(url);
    if (disbursementMethod) {
      storeBalance.disbursement_method = disbursementMethod;
    }
    storeBalance.store = store;
    return storeBalance;
  }

  async detailStoreBalance(store_id: string, user: any): Promise<any> {
    const store = await this.merchantService.merchantValidation(store_id, user);
    await this.maskingAccountNameNumber(store, 'store');

    const balanceSetting = await this.settingsService.getSettingsByNames([
      'eligible_disburse_min_amount',
    ]);
    const disburseMinAmount = Number(balanceSetting[0].value);
    const storeBalance = await this.storeBalanceHistoryRepository
      .detailStoreBalance(store_id, disburseMinAmount)
      .catch(async (err) => {
        console.error(err);
        throw await this.responseService.httpExceptionHandling(
          store_id,
          'store_id',
          'general.general.dataNotFound',
          404,
        );
      });
    if (!storeBalance) {
      throw await this.responseService.httpExceptionHandling(
        store_id,
        'store_id',
        'general.general.dataNotFound',
        404,
      );
    }
    return {
      store: store,
      balance: storeBalance,
    };
  }

  async listStoresBalance(data: ListStoresDto, user: any): Promise<any> {
    const url = `${process.env.BASEURL_MERCHANTS_SERVICE}/api/v1/internal/merchants/stores/bylevel`;
    const bodyData = {
      data: data,
      user: user,
    };
    const stores: any = await this.commonService.postHttp(url, bodyData);
    if (!stores) {
      throw await this.responseService.httpExceptionHandling(
        '',
        '',
        'general.general.dataNotFound',
        404,
      );
    }
    const balanceSetting = await this.settingsService.getSettingsByNames([
      'eligible_disburse_min_amount',
    ]);
    const disburseMinAmount = Number(balanceSetting[0].value);
    const listItems = [];
    for (const store of stores.items) {
      await this.maskingAccountNameNumber(store, 'store');
      const storeBalance = await this.storeBalanceHistoryRepository
        .detailStoreBalance(store.id, disburseMinAmount)
        .catch(async (err) => {
          console.error(err);
          throw await this.responseService.httpExceptionHandling(
            store.id,
            'store_id',
            'general.general.dataNotFound',
            404,
          );
        });
      const storeAndBalance = {
        store: store,
        balance: storeBalance,
      };
      listItems.push(storeAndBalance);
    }
    stores.items = listItems;
    return stores;
  }

  async storeDisbursementValidation(
    data: StoreDisbursementDto,
    store_id: string,
    user: any,
  ): Promise<any> {
    const store = await this.merchantService.merchantValidation(store_id, user);
    const url = `${process.env.BASEURL_PAYMENTS_SERVICE}/api/v1/payments/internal/disbursement_method/${store.bank_id}`;
    const disbursementMethod: any = await this.commonService.getHttp(url);
    const balanceSetting = await this.settingsService.getSettingsByNames([
      'eligible_disburse_min_amount',
    ]);
    const disburseMinAmount = Number(balanceSetting[0].value);
    const storeBalance = await this.storeBalanceHistoryRepository
      .detailStoreBalance(store_id, disburseMinAmount)
      .catch(async (err) => {
        console.error(err);
        throw await this.responseService.httpExceptionHandling(
          store_id,
          'store_id',
          'general.general.dataNotFound',
          404,
        );
      });
    if (!storeBalance) {
      throw await this.responseService.httpExceptionHandling(
        store_id,
        'store_id',
        'general.general.dataNotFound',
        404,
      );
    }
    const maxBalance = Number(storeBalance.eligible_balance);
    if (
      data.amount > maxBalance ||
      data.amount > disbursementMethod.max_amount
    ) {
      throw await this.responseService.httpExceptionHandling(
        data.amount,
        'amount',
        'general.general.overLimit',
        400,
      );
    } else if (data.amount < disbursementMethod.min_amount) {
      throw await this.responseService.httpExceptionHandling(
        data.amount,
        'amount',
        'general.general.underLimit',
        400,
      );
    }

    const skg = new Date();
    const storeBalanceData: Partial<StoreBalanceHistoryDocument> = {
      store_id: store_id,
      type: StoreTransactionType.DISBURSEMENT,
      amount: -data.amount,
      status: StoreTransactionStatus.INPROCESS,
      recorded_at: skg,
      eligible_at: skg,
      group_id: store.merchant.group.id,
      merchant_id: store.merchant.id,
      notes: data.notes,
      created_by: user.id,
      created_by_type: user.user_type,
      account_no: store.bank_account_no,
      account_name: store.bank_account_name,
      disbursement_method_id: store.bank_id,
    };
    const storeBalanceHistory = await this.storeBalanceHistoryRepository.save(
      storeBalanceData,
    );

    const disbursementData: Partial<StoreDisbursementHistoryDocument> = {
      store_balance_history: storeBalanceHistory,
      status: StoreDisbursementTransactionStatus.INPROCESS,
    };

    //Broadcast
    const eventName = 'balances.disbursement.store.created';
    this.natsService.clientEmit(eventName, storeBalanceHistory);

    await this.storeDisbursementHistory.save(disbursementData);
    storeBalanceHistory.disbursement_method = disbursementMethod;
    storeBalanceHistory.amount = Math.abs(storeBalanceHistory.amount);
    await this.maskingAccountNameNumber(
      storeBalanceHistory,
      'store_balance_history',
    );
    await this.maskingAccountNameNumber(store, 'store');
    storeBalanceHistory.store = store;

    // const arrAccName = storeBalanceHistory.account_name.split(' ');
    // let maskName = '';
    // for (const subName of arrAccName) {
    //   maskName += `${subName.substring(0, 1)}${subName
    //     .substring(1)
    //     .replace(/./g, '*')} `;
    // }
    // storeBalanceHistory.account_name = maskName.substring(
    //   0,
    //   maskName.length - 1,
    // );
    // storeBalanceHistory.account_no = `${storeBalanceHistory.account_no.substring(
    //   0,
    //   3,
    // )}${storeBalanceHistory.account_no.substring(3).replace(/./g, '*')}`;

    return storeBalanceHistory;
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
