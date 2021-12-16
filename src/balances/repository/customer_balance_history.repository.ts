import { EntityRepository, Repository } from 'typeorm';
import { CustomerBalanceHistoryDocument } from '../entities/customer_balance_history.entity';

@EntityRepository(CustomerBalanceHistoryDocument)
export class CustomerBalanceHistoryRepository extends Repository<CustomerBalanceHistoryDocument> {
  constructor() {
    super();
  }
}
