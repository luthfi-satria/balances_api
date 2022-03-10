import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { CommonService } from 'src/common/common.service';
import { NatsService } from 'src/common/nats/nats.service';
import { ResponseService } from 'src/response/response.service';
import { BanksService } from './banks.service';
import { CustomersService } from './customers.service';
import {
  AddCustomerDisbursementDto,
  ValidateCustomerDisbursementDto,
} from './dto/customers_disbursements.dto';
import {
  CustomerBalanceHistoryDocument,
  TransactionStatus,
  TransactionType,
} from './entities/customer_balance_history.entity';
import {
  CustomerDisbursementHistoryDocument,
  DisbursementTransactionStatus,
} from './entities/customer_disbursement_history.entity';
import { CustomerDisbursementHistoryRepository } from './repository/customer_disbursement_history.repository';

@Injectable()
export class DisbursementService {
  constructor(
    private readonly banksService: BanksService,
    private readonly responseService: ResponseService,
    private readonly commonService: CommonService,
    private readonly customersService: CustomersService,
    private readonly customerDisbursementHistoryRepository: CustomerDisbursementHistoryRepository,
    private readonly natsService: NatsService,
  ) {}

  async disbursement(
    data: AddCustomerDisbursementDto,
    customer_id: string,
  ): Promise<any> {
    const customerBank = await this.banksService.findCustomerBankById(
      data.customer_bank_id,
    );
    if (!customerBank) {
      throw await this.responseService.httpExceptionHandling(
        data.customer_bank_id,
        'customer_bank_id',
        'general.general.dataNotFound',
        404,
      );
    }
    if (customerBank.customer_id != customer_id) {
      throw await this.responseService.httpExceptionHandling(
        customer_id,
        'customer_id',
        'general.general.invalidValue',
        400,
      );
    }

    const url = `${process.env.BASEURL_PAYMENTS_SERVICE}/api/v1/internal/payments/disbursement_method/${customerBank.disbursement_method_id}`;
    const disbursementMethod: any =
      await this.commonService.getDetailStoreBalance(url);
    const customerBalance: any =
      await this.customersService.detailCustomerBalance(customer_id);
    const maxBalance = customerBalance.eligible_balance;

    if (
      data.amount > maxBalance ||
      data.amount > disbursementMethod.max_amount
    ) {
      throw await this.responseService.httpExceptionHandling(
        data.amount,
        'amount',
        'general.general.overLimit',
        400,
      );
    } else if (data.amount < disbursementMethod.min_amount) {
      throw await this.responseService.httpExceptionHandling(
        data.amount,
        'amount',
        'general.general.underLimit',
        400,
      );
    }

    let flagThrowpass = false;
    try {
      // Get Customer Phone
      const urlCustomer = `${process.env.BASEURL_CUSTOMERS_SERVICE}/api/v1/internal/customers/${customer_id}`;
      const customer: any = await this.commonService.getHttp(urlCustomer);

      if (customer.phone_verified_at != null) {
        const pvaPermissionDate = moment(customer.phone_verified_at).add(
          1,
          'days',
        );
        const skg = moment(new Date());
        if (pvaPermissionDate > skg) {
          flagThrowpass = true;
          throw await this.responseService.httpExceptionHandling(
            customer.phone,
            'phone',
            'general.general.unverifiedPhone',
            400,
          );
        }
      }

      flagThrowpass = true;
      try {
        //Create OTP
        const urlOtp = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/otp-phone`;
        const body = {
          phone: customer.phone,
          user_type: 'customer_disbursement',
          name: customer.name,
        };
        const auth: any = await this.commonService.postHttp(urlOtp, body);

        return auth;
      } catch (err: any) {
        throw await this.responseService.httpExceptionHandling(
          '',
          '',
          'general.general.failedTransaction',
          400,
        );
      }
    } catch (err: any) {
      if (flagThrowpass) {
        throw err;
      }
      throw await this.responseService.httpExceptionHandling(
        customer_id,
        'customer_id',
        'general.general.dataNotFound',
        400,
      );
    }
  }

  async disbursementValidation(
    data: ValidateCustomerDisbursementDto,
    customer_id: string,
  ): Promise<any> {
    const customerBank = await this.banksService.findCustomerBankById(
      data.customer_bank_id,
    );
    if (!customerBank) {
      throw await this.responseService.httpExceptionHandling(
        data.customer_bank_id,
        'customer_bank_id',
        'general.general.dataNotFound',
        404,
      );
    }
    if (customerBank.customer_id != customer_id) {
      throw await this.responseService.httpExceptionHandling(
        customer_id,
        'customer_id',
        'general.general.invalidValue',
        400,
      );
    }

    const url = `${process.env.BASEURL_PAYMENTS_SERVICE}/api/v1/internal/payments/disbursement_method/${customerBank.disbursement_method_id}`;
    const disbursementMethod: any =
      await this.commonService.getDetailStoreBalance(url);
    console.log(url, '=> disbursement.service.disbursementValidation > url');
    console.log(
      disbursementMethod,
      '=> disbursement.service.disbursementValidation > disbursementMethod',
    );
    const customerBalance: any =
      await this.customersService.detailCustomerBalance(customer_id);
    const maxBalance = Number(customerBalance.eligible_balance);
    if (
      data.amount > maxBalance ||
      data.amount > disbursementMethod.max_amount
    ) {
      throw await this.responseService.httpExceptionHandling(
        data.amount,
        'amount',
        'general.general.overLimit',
        400,
      );
    } else if (data.amount < disbursementMethod.min_amount) {
      throw await this.responseService.httpExceptionHandling(
        data.amount,
        'amount',
        'general.general.underLimit',
        400,
      );
    }

    let flagThrowpass = false;
    try {
      // Get Customer Phone
      const urlCustomer = `${process.env.BASEURL_CUSTOMERS_SERVICE}/api/v1/internal/customers/${customer_id}`;
      const customer: any = await this.commonService.getHttp(urlCustomer);

      if (customer.phone_verified_at != null) {
        const pvaPermissionDate = moment(customer.phone_verified_at).add(
          1,
          'days',
        );
        const skg = moment();
        if (pvaPermissionDate > skg) {
          flagThrowpass = true;
          throw await this.responseService.httpExceptionHandling(
            customer.phone,
            'phone',
            'general.general.unverifiedPhone',
            400,
          );
        }
      }

      try {
        flagThrowpass = true;

        //Create OTP
        const urlOtp = `${process.env.BASEURL_AUTH_SERVICE}/api/v1/auth/otp-phone-validation`;
        const body = {
          phone: customer.phone,
          otp_code: data.otp_code,
          user_type: 'customer_disbursement',
        };
        const auth: any = await this.commonService.postHttp(urlOtp, body);

        if (auth.statusCode) {
          throw await this.responseService.httpExceptionHandling(
            `${auth.message[0].value}`,
            `${auth.message[0].property}`,
            'general.general.failedTransaction',
            400,
          );
        }
        const skg = new Date();
        const custBalanceData: Partial<CustomerBalanceHistoryDocument> = {
          customer_id: customer_id,
          type: TransactionType.DISBURSEMENT,
          amount: -data.amount,
          status: TransactionStatus.INPROCESS,
          recorded_at: skg,
          eligible_at: skg,
          customer_bank: customerBank,
        };
        const customerBalanceHistory =
          await this.customersService.saveCustomerBalanceHistory(
            custBalanceData,
          );

        const disbursementData: Partial<CustomerDisbursementHistoryDocument> = {
          customer_balance_history: customerBalanceHistory,
          status: DisbursementTransactionStatus.INPROCESS,
        };
        customerBalanceHistory.customer_bank.disbursement_method =
          disbursementMethod;

        //Broadcast
        const eventName = 'balances.disbursement.customer.created';
        this.natsService.clientEmit(eventName, customerBalanceHistory);

        return await this.customerDisbursementHistoryRepository.save(
          disbursementData,
        );
      } catch (err: any) {
        if (flagThrowpass) {
          throw err;
        }
        throw await this.responseService.httpExceptionHandling(
          '',
          '',
          'general.general.failedTransaction',
          400,
        );
      }
    } catch (err: any) {
      if (flagThrowpass) {
        throw err;
      }
      throw await this.responseService.httpExceptionHandling(
        customer_id,
        'customer_id',
        'general.general.dataNotFound',
        400,
      );
    }
  }

  async saveCustomerDisbursementHistory(
    data: Partial<CustomerDisbursementHistoryDocument>,
  ): Promise<CustomerDisbursementHistoryDocument> {
    return this.customerDisbursementHistoryRepository.save(data);
  }
}
