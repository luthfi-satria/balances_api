import { Injectable } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { DisbursementService } from 'src/customers/disbursement.service';
import {
  TransactionStatus,
  TransactionType,
} from 'src/customers/entities/customer_balance_history.entity';
import {
  CustomerDisbursementHistoryDocument,
  DisbursementTransactionStatus,
} from 'src/customers/entities/customer_disbursement_history.entity';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class BalancesService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly responseService: ResponseService,
    private readonly disbursementService: DisbursementService,
  ) {}
  async paymentDisbursementStatus(data: any, eventStatus: boolean) {
    if (data.recipient == 'CUSTOMER') {
      const criteriaData = {
        id: data.balance_id,
        order_id: data.order_id,
        customer_id: data.user_id,
        type: TransactionType.DISBURSEMENT,
      };
      const customerBalanceHistory =
        await this.customersService.findCustomerBalanceByCriteria(criteriaData);
      if (customerBalanceHistory) {
        customerBalanceHistory.status = eventStatus
          ? TransactionStatus.SUCCESS
          : TransactionStatus.FAILED;

        const disbursementData: Partial<CustomerDisbursementHistoryDocument> = {
          customer_balance_history: customerBalanceHistory,
          status: eventStatus
            ? DisbursementTransactionStatus.SUCCESS
            : DisbursementTransactionStatus.FAILED,
        };
        this.disbursementService.saveCustomerDisbursementHistory(
          disbursementData,
        );
      }
    }
  }
}
