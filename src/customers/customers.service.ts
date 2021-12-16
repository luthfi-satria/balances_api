import { Injectable } from '@nestjs/common';
import {
  CustomerBalanceHistoryDocument,
  TransactionStatus,
  TransactionType,
} from 'src/balances/entities/customer_balance_history.entity';
import { CustomerBalanceHistoryRepository } from 'src/balances/repository/customer_balance_history.repository';

@Injectable()
export class CustomersService {
  constructor(
    private readonly customerBalanceHistoryRepository: CustomerBalanceHistoryRepository,
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
    this.customerBalanceHistoryRepository.save(custBalanceHistoryData);
  }

  async listCustomerBalanceHistories(data: any): Promise<any> {
    return this.customerBalanceHistoryRepository.find();
  }
}
