import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { CommonService } from 'src/common/common.service';
import { ListResponse } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { SettingsService } from 'src/settings/settings.service';
import {
  ListStoresBalancesDto,
  ListStoresDto,
  StoreDisbursementBulkDto,
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
import { RedisBalanceService } from 'src/common/redis/redis-balance.service';
import { CreateAutoDisbursementBalanceDto } from 'src/common/redis/dto/redis-balance.dto';
import { cronGen } from 'src/utils/general-utils';
import { SettingsDocument } from 'src/settings/entities/settings.entity';
import { AutomaticDisburseAtValues } from 'src/settings/dto/settings.dto';

@Injectable()
export class StoresService {
  logger = new Logger();
  constructor(
    private readonly storeBalanceHistoryRepository: StoreBalanceHistoryRepository,
    @Inject(forwardRef(() => SettingsService))
    private readonly settingsService: SettingsService,
    private readonly storeDisbursementHistory: StoreDisbursementHistoryRepository,
    private readonly responseService: ResponseService,
    private readonly commonService: CommonService,
    private readonly merchantService: MerchantService,
    private readonly natsService: NatsService,
    private readonly redisBalanceService: RedisBalanceService,
  ) {}

  async saveOrderComplete(data: any) {
    if (data.platform == 'ONLINE') {
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
      .findOne(store_history_id)
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
    let store = null;
    if (user) {
      store = await this.merchantService.merchantValidation(store_id, user);
    }
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
    if (store.bank_id) {
      const url = `${process.env.BASEURL_PAYMENTS_SERVICE}/api/v1/payments/internal/disbursement_method/${store.bank_id}`;
      const disbursementMethod = await this.commonService.getHttp(url);
      if (disbursementMethod) {
        store.disbursement_method = disbursementMethod;
      } else {
        store.disbursement_method = null;
      }
    } else {
      store.disbursement_method = null;
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
    const listDisbursementMethod = [];
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
      if (store.bank_id) {
        const idx = _.findIndex(listDisbursementMethod, function (ix: any) {
          return ix.id == store.bank_id;
        });
        if (idx == -1) {
          const urlPay = `${process.env.BASEURL_PAYMENTS_SERVICE}/api/v1/payments/internal/disbursement_method/${store.bank_id}`;
          const disbursementMethod = await this.commonService.getHttp(urlPay);
          if (disbursementMethod) {
            store.disbursement_method = disbursementMethod;
            listDisbursementMethod.push(disbursementMethod);
          } else {
            store.disbursement_method = null;
          }
        } else {
          store.disbursement_method = listDisbursementMethod[idx];
        }
      } else {
        store.disbursement_method = null;
      }

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
    if (maxBalance <= 0) {
      throw await this.responseService.httpExceptionHandling(
        maxBalance,
        'eligible_balance',
        'general.general.underLimit',
        400,
      );
    }

    const skg = new Date();
    const storeBalanceData: Partial<StoreBalanceHistoryDocument> = {
      store_id: store_id,
      type: StoreTransactionType.DISBURSEMENT,
      amount: -maxBalance,
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
    const praStoreBalanceHistory =
      await this.storeBalanceHistoryRepository.save(storeBalanceData);

    const disbursementData: Partial<StoreDisbursementHistoryDocument> = {
      store_balance_history: praStoreBalanceHistory,
      status: StoreDisbursementTransactionStatus.INPROCESS,
    };
    await this.storeDisbursementHistory.save(disbursementData);

    const storeBalanceHistory =
      await this.storeBalanceHistoryRepository.findOne(
        praStoreBalanceHistory.id,
      );
    console.log(
      storeBalanceHistory,
      '=> stores.service.storeDisbursementValidation > storeBalanceHistory',
    );

    const url = `${process.env.BASEURL_PAYMENTS_SERVICE}/api/v1/payments/internal/disbursement_method/${storeBalanceHistory?.disbursement_method_id}`;
    console.log(url, '=> stores.service.storeDisbursementValidation > url');
    const disbursementMethod: any = await this.commonService.getHttp(url);
    console.log(
      disbursementMethod,
      '=> stores.service.storeDisbursementValidation > disbursementMethod',
    );

    //Broadcast
    storeBalanceHistory.disbursement_method = disbursementMethod;
    const eventStoreBalanceHistory = Object.assign({}, storeBalanceHistory);
    const eventName = 'balances.disbursement.store.created';
    console.log(
      eventStoreBalanceHistory,
      '=> stores.service.storeDisbursementValidation > eventStoreBalanceHistory',
    );
    this.natsService.clientEmit(eventName, eventStoreBalanceHistory);

    storeBalanceHistory.store = store;
    storeBalanceHistory.amount = Math.abs(storeBalanceHistory.amount);
    await this.maskingAccountNameNumber(
      storeBalanceHistory,
      'store_balance_history',
    );
    await this.maskingAccountNameNumber(storeBalanceHistory.store, 'store');

    return storeBalanceHistory;
  }

  async storeDisbursementValidationBulk(
    data: StoreDisbursementBulkDto,
    user: any,
  ): Promise<any> {
    const listStores = [];
    const disbursementMethodIndex = {};

    for (const store_id of data.store_ids) {
      const store = await this.merchantService.merchantValidation(
        store_id,
        user,
      );
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
      if (maxBalance <= 0) {
        throw await this.responseService.httpExceptionHandling(
          maxBalance,
          'eligible_balance',
          'general.general.underLimit',
          400,
        );
      }
      const listStore = {
        store_id: store_id,
        store: store,
        disbursementMethod: null,
        maxBalance: maxBalance,
      };
      listStores.push(listStore);
    }

    const listStoreBalances = [];
    for (const store of listStores) {
      const skg = new Date();
      const storeBalanceData: Partial<StoreBalanceHistoryDocument> = {
        store_id: store.store_id,
        type: StoreTransactionType.DISBURSEMENT,
        amount: -store.maxBalance,
        status: StoreTransactionStatus.INPROCESS,
        recorded_at: skg,
        eligible_at: skg,
        group_id: store.store.merchant.group.id,
        merchant_id: store.store.merchant.id,
        notes: data.notes,
        created_by: user.id,
        created_by_type: user.user_type,
        account_no: store.store.bank_account_no,
        account_name: store.store.bank_account_name,
        disbursement_method_id: store.store.bank_id,
      };
      const praStoreBalanceHistory =
        await this.storeBalanceHistoryRepository.save(storeBalanceData);

      const disbursementData: Partial<StoreDisbursementHistoryDocument> = {
        store_balance_history: praStoreBalanceHistory,
        status: StoreDisbursementTransactionStatus.INPROCESS,
      };
      await this.storeDisbursementHistory.save(disbursementData);

      const storeBalanceHistory =
        await this.storeBalanceHistoryRepository.findOne(
          praStoreBalanceHistory.id,
        );
      console.log(
        storeBalanceHistory,
        '=> stores.service.storeDisbursementValidationBulk > storeBalanceHistory',
      );

      if (
        !disbursementMethodIndex[storeBalanceHistory?.disbursement_method_id] &&
        storeBalanceHistory?.disbursement_method_id
      ) {
        const url = `${process.env.BASEURL_PAYMENTS_SERVICE}/api/v1/payments/internal/disbursement_method/${storeBalanceHistory?.disbursement_method_id}`;
        console.log(
          url,
          '=> stores.service.storeDisbursementValidationBulk > url',
        );
        const disbursementMethod: any = await this.commonService.getHttp(url);
        console.log(
          disbursementMethod,
          '=> stores.service.storeDisbursementValidationBulk > disbursementMethod',
        );
        disbursementMethodIndex[storeBalanceHistory.disbursement_method_id] =
          disbursementMethod;
      }

      //Broadcast
      storeBalanceHistory.disbursement_method =
        disbursementMethodIndex[storeBalanceHistory?.disbursement_method_id];
      const eventStoreBalanceHistory = Object.assign({}, storeBalanceHistory);
      const eventName = 'balances.disbursement.store.created';
      console.log(
        eventStoreBalanceHistory,
        '=> stores.service.storeDisbursementValidationBulk > eventStoreBalanceHistory',
      );
      this.natsService.clientEmit(eventName, eventStoreBalanceHistory);

      storeBalanceHistory.amount = Math.abs(storeBalanceHistory.amount);
      storeBalanceHistory.store = store.store;
      await this.maskingAccountNameNumber(
        storeBalanceHistory,
        'store_balance_history',
      );
      await this.maskingAccountNameNumber(storeBalanceHistory.store, 'store');
      listStoreBalances.push(storeBalanceHistory);
    }

    return listStoreBalances;
  }

  async createAutoDisbursement() {
    const settings = await this.settingsService.getSettings();

    const crons = this.generateCronsFromSettings(settings);
    const jobId = 'autoDisbursementBalance';

    //=> clear the cron jobs first
    await this.redisBalanceService.clearAutoDisbursementBalanceJobs({
      job_id: jobId,
    });

    //=> then create new jobs
    for (const cron of crons) {
      const payload: CreateAutoDisbursementBalanceDto = {
        job_id: jobId,
        repeat: {
          cron,
          tz: 'Asia/Jakarta',
        },
      };
      await this.redisBalanceService.createAutoDisbursementBalanceJob(payload);
    }
  }

  generateCronsFromSettings(settings: SettingsDocument[]): string[] {
    let automaticDisburseAt = null;
    let automaticDisburseDay = null;
    let automaticDisburseDate = null;
    let automaticDisburseTime = null;
    const automaticDisburseMinute = {};
    const crons = [];

    for (const setting of settings) {
      switch (setting.name) {
        case 'automatic_disburse_at':
          automaticDisburseAt = setting.value;
          break;
        case 'automatic_disburse_day':
          automaticDisburseDay = setting.value;
          break;
        case 'automatic_disburse_date':
          automaticDisburseDate = setting.value;
          break;
        case 'automatic_disburse_time':
          automaticDisburseTime = setting.value;
          break;
      }
    }

    //=> cek automaticDisburseAt
    if (automaticDisburseAt === AutomaticDisburseAtValues.DAILY) {
      automaticDisburseDate = '*';
      automaticDisburseDay = '*';
    } else if (automaticDisburseAt === AutomaticDisburseAtValues.WEEKLY) {
      automaticDisburseDate = '*';
    } else if (automaticDisburseAt === AutomaticDisburseAtValues.DATE) {
      automaticDisburseDay = '*';
    }

    //=> cek multiple minute patterns
    if (automaticDisburseTime && automaticDisburseTime?.length) {
      for (const time of automaticDisburseTime) {
        const [hour, minute] = time.split(':');
        if (automaticDisburseMinute[minute]) {
          automaticDisburseMinute[minute].push(hour);
        } else {
          automaticDisburseMinute[minute] = [hour];
        }
      }
    }

    for (const minute in automaticDisburseMinute) {
      if (
        Object.prototype.hasOwnProperty.call(automaticDisburseMinute, minute)
      ) {
        const hours: string[] = automaticDisburseMinute[minute];
        const hoursString = hours.toString();

        const cron = cronGen(
          minute,
          hoursString,
          automaticDisburseDate,
          '*',
          automaticDisburseDay,
        );

        if (cron) {
          crons.push(cron);
        }
      }
    }

    return crons;
  }

  async storeDisbursementScheduler(): Promise<any> {
    const urlStore = `${process.env.BASEURL_MERCHANTS_SERVICE}/api/v1/internal/merchants/stores/by/automatic_refund`;
    const stores: any = await this.commonService.getHttp(urlStore);
    this.logger.log(stores.data.length, 'stores length');

    const disbursementMethodIndex = {};

    if (stores.data.length > 0) {
      const listStores = [];
      for (const store of stores.data) {
        this.logger.log(store.id, 'store id     ');
        this.logger.log(store.bank_id, 'bank id      ');

        if (store.bank_id) {
          const balanceSetting = await this.settingsService.getSettingsByNames([
            'eligible_disburse_min_amount',
          ]);
          const disburseMinAmount = Number(balanceSetting[0].value);
          const storeBalance =
            await this.storeBalanceHistoryRepository.detailStoreBalance(
              store.id,
              disburseMinAmount,
            );
          this.logger.log(storeBalance, 'storeBalance ');

          if (storeBalance) {
            const maxBalance = Number(storeBalance.eligible_balance);
            if (maxBalance > 0) {
              const listStore = {
                store_id: store.id,
                store: store,
                disbursementMethod: null,
                maxBalance: maxBalance,
              };
              listStores.push(listStore);
            }
          }
        }
      }
      const listStoreBalances = [];
      if (listStores.length > 0) {
        for (const store of listStores) {
          const skg = new Date();
          const storeBalanceData: Partial<StoreBalanceHistoryDocument> = {
            store_id: store.store_id,
            type: StoreTransactionType.DISBURSEMENT,
            amount: -store.maxBalance,
            status: StoreTransactionStatus.INPROCESS,
            recorded_at: skg,
            eligible_at: skg,
            group_id: store.store.merchant.group.id,
            merchant_id: store.store.merchant.id,
            notes: 'Pencairan Saldo Otomatis',
            created_by: '',
            created_by_type: 'system',
            account_no: store.store.bank_account_no,
            account_name: store.store.bank_account_name,
            disbursement_method_id: store.store.bank_id,
          };
          const praStoreBalanceHistory =
            await this.storeBalanceHistoryRepository.save(storeBalanceData);

          const disbursementData: Partial<StoreDisbursementHistoryDocument> = {
            store_balance_history: praStoreBalanceHistory,
            status: StoreDisbursementTransactionStatus.INPROCESS,
          };
          await this.storeDisbursementHistory.save(disbursementData);

          const storeBalanceHistory =
            await this.storeBalanceHistoryRepository.findOne(
              praStoreBalanceHistory.id,
            );
          console.log(
            storeBalanceHistory,
            '=> stores.service.storeDisbursementScheduler > storeBalanceHistory',
          );

          if (
            !disbursementMethodIndex[
              storeBalanceHistory?.disbursement_method_id
            ] &&
            storeBalanceHistory?.disbursement_method_id
          ) {
            const url = `${process.env.BASEURL_PAYMENTS_SERVICE}/api/v1/payments/internal/disbursement_method/${storeBalanceHistory?.disbursement_method_id}`;
            console.log(
              url,
              '=> stores.service.storeDisbursementScheduler > url',
            );
            const disbursementMethod: any = await this.commonService.getHttp(
              url,
            );
            console.log(
              disbursementMethod,
              '=> stores.service.storeDisbursementScheduler > disbursementMethod',
            );

            disbursementMethodIndex[
              storeBalanceHistory.disbursement_method_id
            ] = disbursementMethod;
          }

          //Broadcast
          storeBalanceHistory.disbursement_method =
            disbursementMethodIndex[
              storeBalanceHistory?.disbursement_method_id
            ];
          const eventStoreBalanceHistory = Object.assign(
            {},
            storeBalanceHistory,
          );
          const eventName = 'balances.disbursement.store.created';
          console.log(
            eventStoreBalanceHistory,
            '=> stores.service.storeDisbursementScheduler > eventStoreBalanceHistory',
          );
          this.natsService.clientEmit(eventName, eventStoreBalanceHistory);

          storeBalanceHistory.amount = Math.abs(storeBalanceHistory.amount);
          storeBalanceHistory.store = store.store;
          await this.maskingAccountNameNumber(
            storeBalanceHistory,
            'store_balance_history',
          );
          await this.maskingAccountNameNumber(
            storeBalanceHistory.store,
            'store',
          );
          listStoreBalances.push(storeBalanceHistory);
        }
      }
      return listStoreBalances;
    }
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
