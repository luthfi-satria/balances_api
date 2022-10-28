import { StoreBalanceHistoryDocument } from 'src/stores/entities/store_balance_history.entity';
import { Between, EntityRepository, Repository } from 'typeorm';

@EntityRepository(StoreBalanceHistoryDocument)
export class StoreBalanceReportRepository extends Repository<StoreBalanceHistoryDocument> {
  constructor() {
    super();
  }

  async getBalanceHistory(param: any) {
    try {
      const paramKey = [
        'page',
        'limit',
        'recorded_start',
        'recorded_end',
        // 'eligible_start',
        // 'eligible_end',
        'sort',
        'orientation',
      ];
      const page = param.page || 1;
      const limit = param.limit || 10;
      const offset = (page - 1) * limit;
      const orderBy = param.sort || 'recorded_at';
      const orientation = param.orientation || 'DESC';
      const order = {};
      order[orderBy] = orientation;

      const recordDate = await this.getBeginAndLastDate();
      if (typeof param.recorded_start == 'undefined') {
        console.log(recordDate);
        param.recorded_start = recordDate[0].min_record_date;
      }
      if (typeof param.recorded_end == 'undefined') {
        param.recorded_end = recordDate[0].max_record_date;
      }
      // if (typeof param.eligible_start == 'undefined') {
      //   param.eligible_start = recordDate[0].min_eligible_date;
      // }
      // if (typeof param.eligible_end == 'undefined') {
      //   param.eligible_end = recordDate[0].max_eligible_date;
      // }

      const src = {};
      Object.keys(param).forEach((key) => {
        if (paramKey.includes(key) == false && param[key] != '') {
          src[key] = param[key];
        } else if (key == 'recorded_start' || key == 'recorded_end') {
          src['recorded_at'] = Between(
            param['recorded_start'],
            param['recorded_end'],
          );
        }
        // else if (key == 'eligible_start' || key == 'eligible_end') {
        //   src['eligible_at'] = Between(
        //     param['eligible_start'],
        //     param['eligible_end'],
        //   );
        // }
      });

      const storeBalance = await this.find({
        select: [
          'id',
          'group_id',
          'merchant_id',
          'store_id',
          'type',
          'amount',
          'status',
          'recorded_at',
          'eligible_at',
          'disbursement_method_id',
        ],
        where: src,
        take: limit,
        skip: offset,
        order: order,
      });

      return storeBalance;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getBeginAndLastDate() {
    return this.createQueryBuilder()
      .select([
        "TO_CHAR(max(recorded_at), 'YYYY-MM-DD') as max_record_date",
        "TO_CHAR(min(recorded_at), 'YYYY-MM-DD') as min_record_date",
        "TO_CHAR(max(eligible_at), 'YYYY-MM-DD') as max_eligible_date",
        "TO_CHAR(min(eligible_at), 'YYYY-MM-DD') as min_eligible_date",
      ])
      .execute();
  }
}
