import { Injectable } from '@nestjs/common';
import {
  CustomerBalanceHistoryDocument,
  TransactionStatus,
  TransactionType,
} from 'src/customers/entities/customer_balance_history.entity';
import { CustomerBalanceHistoryRepository } from 'src/customers/repository/customer_balance_history.repository';
import { ListResponse } from 'src/response/response.interface';

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

  async listCustomerBalanceHistories(
    data: any,
    customer_id: string,
  ): Promise<ListResponse> {
    return this.customerBalanceHistoryRepository.findListCustomersBalanceHistories(
      data,
      customer_id,
    );
  }

  async detailCustomerBalance(customer_id: string): Promise<ListResponse> {
    return this.customerBalanceHistoryRepository.detailCustomersBalance(
      customer_id,
    );
  }
}
