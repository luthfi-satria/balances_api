import { ListResponse } from 'src/response/response.interface';
import { EntityRepository, Repository } from 'typeorm';
import { ListCustomersBalancesDto } from '../dto/customers_balance.dto';
import {
  CustomerBalanceHistoryDocument,
  TransactionStatus,
} from '../entities/customer_balance_history.entity';

@EntityRepository(CustomerBalanceHistoryDocument)
export class CustomerBalanceHistoryRepository extends Repository<CustomerBalanceHistoryDocument> {
  constructor() {
    super();
  }

  async findListCustomersBalanceHistories(
    data: ListCustomersBalancesDto,
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

  async detailCustomersBalance(customer_id: string): Promise<any> {
    const qbalance = this.createQueryBuilder('')
      .select('sum(amount)', 'balance')
      .where('customer_id = :cid', {
        cid: customer_id,
      })
      .andWhere('status IN (:...stat)', {
        stat: [TransactionStatus.SUCCESS, TransactionStatus.INPROCESS],
      });

    const qeligibleBalance = this.createQueryBuilder('')
      .select('sum(amount)', 'balance')
      .where('customer_id = :cid', {
        cid: customer_id,
      })
      .andWhere('status IN (:...stat)', {
        stat: [TransactionStatus.SUCCESS, TransactionStatus.INPROCESS],
      })
      .andWhere('eligible_at <= :skg', { skg: new Date() });

    const qdisbursementInProcess = this.createQueryBuilder('')
      .select('sum(amount)', 'balance')
      .where('customer_id = :cid', {
        cid: customer_id,
      })
      .andWhere('status = :stat', {
        stat: TransactionStatus.INPROCESS,
      });

    try {
      const balance: any = await qbalance.getRawOne();
      const eligibleBalance: any = await qeligibleBalance.getRawOne();
      const disbursementInProcess: any =
        await qdisbursementInProcess.getRawOne();
      return {
        balance: Number(balance.balance),
        eligible_balance: Number(eligibleBalance.balance),
        disbursement_inprocess: Math.abs(Number(disbursementInProcess.balance)),
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
