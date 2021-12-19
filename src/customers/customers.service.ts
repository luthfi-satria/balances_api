import { Injectable } from '@nestjs/common';
import {
  CustomerBalanceHistoryDocument,
  TransactionStatus,
  TransactionType,
} from 'src/customers/entities/customer_balance_history.entity';
import { CustomerBalanceHistoryRepository } from 'src/customers/repository/customer_balance_history.repository';
import { ListResponse } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { ListCustomersBalancesDto } from './dto/customers_balance.dto';

@Injectable()
export class CustomersService {
  constructor(
    private readonly customerBalanceHistoryRepository: CustomerBalanceHistoryRepository,
    private readonly responseService: ResponseService,
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
    data: ListCustomersBalancesDto,
    customer_id: string,
  ): Promise<ListResponse> {
    const custBalances = await this.customerBalanceHistoryRepository
      .findListCustomersBalanceHistories(data, customer_id)
      .catch(async () => {
        throw await this.responseService.httpExceptionHandling(
          customer_id,
          'customer_id',
          'general.general.dataNotFound',
          404,
        );
      });
    if (!custBalances) {
      throw await this.responseService.httpExceptionHandling(
        customer_id,
        'customer_id',
        'general.general.dataNotFound',
        404,
      );
    }
    return custBalances;
  }

  async detailCustomerBalance(customer_id: string): Promise<ListResponse> {
    const custBalance = await this.customerBalanceHistoryRepository
      .detailCustomersBalance(customer_id)
      .catch(async (err) => {
        console.error(err);
        throw await this.responseService.httpExceptionHandling(
          customer_id,
          'customer_id',
          'general.general.dataNotFound',
          404,
        );
      });
    if (!custBalance) {
      throw await this.responseService.httpExceptionHandling(
        customer_id,
        'customer_id',
        'general.general.dataNotFound',
        404,
      );
    }
    return custBalance;
  }
}
