import { ListResponse } from 'src/response/response.interface';
import { EntityRepository, Repository } from 'typeorm';
// import { ListCustomersBalanceHistoriesDto } from '../dto/customers_balance_histories.dto';
import { CustomerBalanceHistoryDocument } from '../entities/customer_balance_history.entity';

@EntityRepository(CustomerBalanceHistoryDocument)
export class CustomerBalanceHistoryRepository extends Repository<CustomerBalanceHistoryDocument> {
  constructor() {
    super();
  }

  async findListCustomersBalanceHistories(
    data: any,
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
    const qList = this.createQueryBuilder('')
      .select('sum(amount)', 'balance')
      .where('customer_id = :cid', {
        cid: customer_id,
      });

    try {
      return await qList.getRawOne();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
