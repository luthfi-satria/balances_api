import { EntityRepository, Repository } from 'typeorm';
import { CustomerDisbursementHistoryDocument } from '../entities/customer_disbursement_history.entity';

@EntityRepository(CustomerDisbursementHistoryDocument)
export class CustomerDisbursementHistoryRepository extends Repository<CustomerDisbursementHistoryDocument> {
  constructor() {
    super();
  }
}
