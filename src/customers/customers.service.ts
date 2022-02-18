import { Injectable } from '@nestjs/common';
import moment from 'moment';
import {
  CustomerBalanceHistoryDocument,
  TransactionStatus,
  TransactionType,
} from 'src/customers/entities/customer_balance_history.entity';
import { CustomerBalanceHistoryRepository } from 'src/customers/repository/customer_balance_history.repository';
import { ListResponse } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { SettingsService } from 'src/settings/settings.service';
import { ListCustomersBalancesDto } from './dto/customers_balance.dto';

@Injectable()
export class CustomersService {
  constructor(
    private readonly customerBalanceHistoryRepository: CustomerBalanceHistoryRepository,
    private readonly responseService: ResponseService,
    private readonly settingsService: SettingsService,
  ) {}

  async saveCustomerRefund(data: any) {
    if (data.platform == 'ONLINE') {
      let totalPayment = 0;
      if (data.total_payment) totalPayment = data.total_payment;

      const eligibleDisbursementAtSetting =
        await this.settingsService.getSettingsByNames(['eligible_disburse_at']);
      const eligibleDisbursementAt = eligibleDisbursementAtSetting[0].value;
      let eligibleAt = null;

      if (eligibleDisbursementAt == 'INSTANTLY') {
        eligibleAt = data.transaction_date;
      } else if (eligibleDisbursementAt.substring(0, 7) == 'D_PLUS_') {
        eligibleAt = moment(data.transaction_date).add(
          eligibleDisbursementAt.substring(7),
          'days',
        );
      }

      const custBalanceHistoryData: Partial<CustomerBalanceHistoryDocument> = {
        order_id: data.id,
        customer_id: data.customer_id,
        type: TransactionType.REFUND,
        amount: totalPayment,
        status: TransactionStatus.SUCCESS,
        recorded_at: data.transaction_date,
        eligible_at: eligibleAt,
      };
      this.customerBalanceHistoryRepository.save(custBalanceHistoryData);
    }
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

  async saveCustomerBalanceHistory(
    data: Partial<CustomerBalanceHistoryDocument>,
  ): Promise<CustomerBalanceHistoryDocument> {
    return this.customerBalanceHistoryRepository.save(data);
  }

  async findCustomerBalanceByCriteria(data: Record<string, any>) {
    return this.customerBalanceHistoryRepository.findOne({ where: data });
  }
}
