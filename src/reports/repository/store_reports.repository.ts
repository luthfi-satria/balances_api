import { StoreBalanceHistoryDocument } from 'src/stores/entities/store_balance_history.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(StoreBalanceHistoryDocument)
export class StoreBalanceReportRepository extends Repository<StoreBalanceHistoryDocument> {
  constructor() {
    super();
  }

  async getBalanceHistory(param: any) {
    const paramKey = ['page', 'limit', 'recorded_start', 'recorded_end'];
    const page = param.page || 1;
    const limit = param.limit || 10;
    const offset = (page - 1) * limit;

    const storeBalance = await this.createQueryBuilder();

    let index = 0;
    Object.keys(param).forEach((key) => {
      if (paramKey.includes(key) == false && param[key] != '') {
        if (index == 0) {
          storeBalance.where(key + '= :value', { value: param[key] });
        } else {
          storeBalance.andWhere(key + '= :value', { value: param[key] });
        }
      } else if (key == 'recorded_start') {
        if (index == 0) {
          storeBalance.where('recorded_at >= :recorded_start', {
            recorded_start: param.recorded_start,
          });
        } else {
          storeBalance.andWhere('recorded_at >= :recorded_start', {
            recorded_start: param.recorded_start,
          });
        }
      } else if (key == 'recorded_end') {
        if (index == 0) {
          storeBalance.where('recorded_at < :recorded_end', {
            recorded_end: param.recorded_end,
          });
        } else {
          storeBalance.andWhere('recorded_at < :recorded_end', {
            recorded_end: param.recorded_end,
          });
        }
      }
      index++;
    });

    try {
      return storeBalance.take(limit).skip(offset).getMany();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
