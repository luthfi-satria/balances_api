import { Injectable } from '@nestjs/common';
import {
  CustomerBalanceHistoryDocument,
  TransactionStatus,
  TransactionType,
} from './entities/customer_balance_history.entity';
import { CustomerBalanceHistoryRepository } from './repository/customer_balance_history.repository';

@Injectable()
export class BalancesService {
  constructor(
    private readonly customerBalanceHistory: CustomerBalanceHistoryRepository,
  ) {}

  async saveCustomerRefund(data: any) {
    let totalPayment = 0;
    if (data.total_payment) totalPayment = data.total_payment;

    const custBalanceHistoryData: Partial<CustomerBalanceHistoryDocument> = {
      order_id: data.id,
      customer_id: data.customer_id,
      type: TransactionType.REFUND,
      amount: totalPayment,
      status: TransactionStatus.SUCCESS,
      recorded_at: data.transaction_date,
    };
    this.customerBalanceHistory.save(custBalanceHistoryData);
  }
}
