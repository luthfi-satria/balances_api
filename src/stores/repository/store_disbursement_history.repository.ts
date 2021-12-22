import { EntityRepository, Repository } from 'typeorm';
import { StoreDisbursementHistoryDocument } from '../entities/store_disbursement_history.entity';

@EntityRepository(StoreDisbursementHistoryDocument)
export class StoreDisbursementHistoryRepository extends Repository<StoreDisbursementHistoryDocument> {
  constructor() {
    super();
  }
}
