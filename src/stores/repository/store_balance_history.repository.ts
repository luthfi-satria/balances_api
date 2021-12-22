import { EntityRepository, Repository } from 'typeorm';
import { StoreBalanceHistoryDocument } from '../entities/store_balance_history.entity';

@EntityRepository(StoreBalanceHistoryDocument)
export class StoreBalanceHistoryRepository extends Repository<StoreBalanceHistoryDocument> {
  constructor() {
    super();
  }
}
