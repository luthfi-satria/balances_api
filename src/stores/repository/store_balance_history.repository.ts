import { ListResponse } from 'src/response/response.interface';
import { EntityRepository, Repository } from 'typeorm';
import { ListStoresBalancesDto } from '../dto/stores_balance.dto';
import {
  StoreBalanceHistoryDocument,
  StoreTransactionStatus,
  StoreTransactionType,
} from '../entities/store_balance_history.entity';

@EntityRepository(StoreBalanceHistoryDocument)
export class StoreBalanceHistoryRepository extends Repository<StoreBalanceHistoryDocument> {
  constructor() {
    super();
  }

  async findListStoresBalanceHistories(
    data: ListStoresBalancesDto,
    user: any,
  ): Promise<ListResponse> {
    const currentPage = data.page || 1;
    const perPage = data.limit || 10;
    let totalItems = 0;

    const qList = this.createQueryBuilder('sbh').leftJoinAndSelect(
      'sbh.histories',
      'sdh',
    );

    if (user.user_type == 'merchant' && user.level == 'group') {
      qList.where('sbh.group_id = :group', {
        group: user.group_id,
      });
      if (data.merchant_id) {
        qList.andWhere('sbh.merchant_id = :merchant', {
          merchant: data.merchant_id,
        });
      }
      if (data.store_id) {
        qList.andWhere('sbh.store_id = :store', {
          store: data.store_id,
        });
      }
    } else if (user.user_type == 'merchant' && user.level == 'merchant') {
      qList.where('sbh.merchant_id = :merchant', {
        merchant: user.merchant_id,
      });
      if (data.store_id) {
        qList.andWhere('sbh.store_id = :store', {
          store: data.store_id,
        });
      }
    } else if (user.user_type == 'merchant' && user.level == 'store') {
      qList.where('sbh.store_id = :store', {
        store: user.store_id,
      });
    } else {
      if (data.group_id) {
        qList.andWhere('sbh.group_id = :group', {
          group: data.group_id,
        });
      }
      if (data.merchant_id) {
        qList.andWhere('sbh.merchant_id = :merchant', {
          merchant: data.merchant_id,
        });
      }
      if (data.store_id) {
        qList.andWhere('sbh.store_id = :store', {
          store: data.store_id,
        });
      }
    }

    if (data.type) {
      qList.andWhere('sbh.type = :type', {
        type: data.type,
      });
    }

    if (data.statuses) {
      qList.andWhere('sbh.status in (:...statuses)', {
        statuses: data.statuses,
      });
    }

    if (data.date_range_start) {
      qList.andWhere('sbh.recorded_at > :start', {
        start: `${data.date_range_start} 00:00:00`,
      });
    }
    if (data.date_range_end) {
      qList.andWhere('sbh.recorded_at <= :end', {
        end: `${data.date_range_end} 23:59:59`,
      });
    }

    qList
      .orderBy('sbh.recorded_at', 'DESC')
      .skip((currentPage - 1) * perPage)
      .take(perPage);

    try {
      const resultList = await qList.getManyAndCount();
      totalItems = resultList[1];

      return {
        total_item: totalItems,
        limit: perPage,
        current_page: currentPage,
        items: resultList[0],
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async findListCustomersBalanceHistories(
    data: ListStoresBalancesDto,
    customer_id: string,
  ): Promise<ListResponse> {
    const currentPage = data.page || 1;
    const perPage = data.limit || 10;
    let totalItems = 0;

    const qList = this.createQueryBuilder('').where('customer_id = :cid', {
      cid: customer_id,
    });
    if (data.date_range_start) {
      qList.andWhere('recorded_at > :start', {
        start: `${data.date_range_start} 00:00:00`,
      });
    }
    if (data.date_range_end) {
      qList.andWhere('recorded_at <= :end', {
        end: `${data.date_range_end} 23:59:59`,
      });
    }
    qList
      .orderBy('recorded_at', 'DESC')
      .skip((currentPage - 1) * perPage)
      .take(perPage);

    try {
      const resultList = await qList.getManyAndCount();
      totalItems = resultList[1];

      return {
        total_item: totalItems,
        limit: perPage,
        current_page: currentPage,
        items: resultList[0],
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async detailStoreBalance(
    store_id: string,
    disburseMinAmount: number,
  ): Promise<any> {
    const qbalance = this.createQueryBuilder('')
      .select('sum(amount)', 'balance')
      .where('store_id = :cid', {
        cid: store_id,
      })
      .andWhere('status IN (:...stat)', {
        stat: [
          StoreTransactionStatus.SUCCESS,
          StoreTransactionStatus.INPROCESS,
        ],
      });

    const qeligibleBalance = this.createQueryBuilder('')
      .select('sum(amount)', 'balance')
      .where('store_id = :cid', {
        cid: store_id,
      })
      .andWhere('status IN (:...stat)', {
        stat: [
          StoreTransactionStatus.SUCCESS,
          StoreTransactionStatus.INPROCESS,
        ],
      })
      .andWhere('eligible_at <= :skg', { skg: new Date() });

    const qdisbursementInProcess = this.createQueryBuilder('')
      .select('sum(amount)', 'balance')
      .where('store_id = :cid', {
        cid: store_id,
      })
      .andWhere('status = :stat', {
        stat: StoreTransactionStatus.INPROCESS,
      });

    const qincome = this.createQueryBuilder('')
      .select('sum(amount)', 'balance')
      .where('store_id = :cid', {
        cid: store_id,
      })
      .andWhere('status = :stat', {
        stat: StoreTransactionStatus.SUCCESS,
      })
      .andWhere('type = :tipe', {
        tipe: StoreTransactionType.BALANCE,
      });

    try {
      const balance: any = await qbalance.getRawOne();
      const eligibleBalance: any = await qeligibleBalance.getRawOne();
      const disbursementInProcess: any =
        await qdisbursementInProcess.getRawOne();
      const income: any = await qincome.getRawOne();
      return {
        balance: Number(balance.balance),
        income: Number(income.balance),
        eligible_balance: Number(eligibleBalance.balance),
        is_disbursable:
          Number(eligibleBalance.balance) < disburseMinAmount ? false : true,
        disbursement_inprocess: Math.abs(Number(disbursementInProcess.balance)),
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
