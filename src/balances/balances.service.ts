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
import {
  StoreTransactionStatus,
  StoreTransactionType,
} from 'src/stores/entities/store_balance_history.entity';
import {
  StoreDisbursementHistoryDocument,
  StoreDisbursementTransactionStatus,
} from 'src/stores/entities/store_disbursement_history.entity';
import { StoresService } from 'src/stores/stores.service';

@Injectable()
export class BalancesService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly disbursementService: DisbursementService,
    private readonly storesService: StoresService,
  ) {}
  async paymentDisbursementStatus(data: any, eventStatus: boolean) {
    if (data.recipient == 'CUSTOMER') {
      const criteriaData = {
        id: data.balance_id,
        customer_id: data.user_id,
        type: TransactionType.DISBURSEMENT,
      };
      const customerBalanceHistory =
        await this.customersService.findCustomerBalanceByCriteria(criteriaData);
      if (customerBalanceHistory) {
        customerBalanceHistory.status = eventStatus
          ? TransactionStatus.SUCCESS
          : TransactionStatus.FAILED;
        const saveCustomerBalanceHistory =
          await this.customersService.saveCustomerBalanceHistory(
            customerBalanceHistory,
          );

        const disbursementData: Partial<CustomerDisbursementHistoryDocument> = {
          customer_balance_history: saveCustomerBalanceHistory,
          status: eventStatus
            ? DisbursementTransactionStatus.SUCCESS
            : DisbursementTransactionStatus.FAILED,
        };
        this.disbursementService.saveCustomerDisbursementHistory(
          disbursementData,
        );
      }
    } else if (data.recipient == 'BRAND') {
      const criteriaData = {
        id: data.balance_id,
        order_id: data.order_id,
        store_id: data.user_id,
        type: StoreTransactionType.DISBURSEMENT,
      };
      const storeBalanceHistory =
        await this.storesService.findStoreBalanceByCriteria(criteriaData);
      if (storeBalanceHistory) {
        storeBalanceHistory.status = eventStatus
          ? StoreTransactionStatus.SUCCESS
          : StoreTransactionStatus.FAILED;
        const saveStoreBalanceHistory =
          await this.storesService.saveStoreBalanceHistory(storeBalanceHistory);

        const disbursementData: Partial<StoreDisbursementHistoryDocument> = {
          store_balance_history: saveStoreBalanceHistory,
          status: eventStatus
            ? StoreDisbursementTransactionStatus.SUCCESS
            : StoreDisbursementTransactionStatus.FAILED,
        };
        this.storesService.saveStoreDisbursementHistory(disbursementData);
      }
    }
  }
}
