import { Injectable } from '@nestjs/common';
import { ResponseService } from 'src/response/response.service';
import {
  AddCustomerBankDto,
  ListCustomersBankDto,
  UpdateCustomerBankDto,
} from './dto/customers_banks.dto';
import { CustomerBankDocument } from './entities/customer_bank.entity';
import { CustomerBankRepository } from './repository/customer_bank.repository';

@Injectable()
export class BanksService {
  constructor(
    private readonly customerBankRepository: CustomerBankRepository,
    private readonly responseService: ResponseService,
  ) {}

  async addBankDestination(
    data: AddCustomerBankDto,
    customer_id: string,
  ): Promise<any> {
    const customerBankData: Partial<CustomerBankDocument> = {};
    Object.assign(customerBankData, data);
    customerBankData.customer_id = customer_id;
    return this.customerBankRepository
      .save(customerBankData)
      .catch(async () => {
        throw await this.responseService.httpExceptionHandling(
          '',
          '',
          'general.general.failedSaveData',
          400,
        );
      });
  }

  async updateBankDestination(
    data: UpdateCustomerBankDto,
    bank_id: string,
    customer_id: string,
  ): Promise<any> {
    const customerBank = await this.customerBankRepository
      .findOne({
        where: { id: bank_id, customer_id: customer_id },
      })
      .catch(async () => {
        throw await this.responseService.httpExceptionHandling(
          bank_id,
          'bank_id',
          'general.general.dataNotFound',
          404,
        );
      });
    if (!customerBank) {
      throw await this.responseService.httpExceptionHandling(
        bank_id,
        'bank_id',
        'general.general.dataNotFound',
        404,
      );
    }
    Object.assign(customerBank, data);
    return this.customerBankRepository.save(customerBank).catch(async (err) => {
      console.error(err);
      throw await this.responseService.httpExceptionHandling(
        bank_id,
        'bank_id',
        'general.general.failedSaveData',
        400,
      );
    });
  }

  async deleteBankDestination(
    bank_id: string,
    customer_id: string,
  ): Promise<any> {
    const customerBank = await this.customerBankRepository
      .findOne({
        where: { id: bank_id, customer_id: customer_id },
      })
      .catch(async (err1) => {
        console.error(err1);
        throw await this.responseService.httpExceptionHandling(
          bank_id,
          'bank_id',
          'general.general.dataNotFound',
          404,
        );
      });
    if (!customerBank) {
      throw await this.responseService.httpExceptionHandling(
        bank_id,
        'bank_id',
        'general.general.dataNotFound',
        404,
      );
    }
    return this.customerBankRepository
      .softDelete(customerBank.id)
      .catch(async () => {
        throw await this.responseService.httpExceptionHandling(
          bank_id,
          'bank_id',
          'general.general.failedSaveData',
          400,
        );
      });
  }

  async viewDetailBankDestination(
    bank_id: string,
    customer_id: string,
  ): Promise<any> {
    const customerBank = await this.customerBankRepository
      .findOne({
        where: { id: bank_id, customer_id: customer_id },
      })
      .catch(async (err2) => {
        console.error(err2);
        throw await this.responseService.httpExceptionHandling(
          bank_id,
          'bank_id',
          'general.general.dataNotFound',
          404,
        );
      });
    if (!customerBank) {
      throw await this.responseService.httpExceptionHandling(
        bank_id,
        'bank_id',
        'general.general.dataNotFound',
        404,
      );
    }
    return customerBank;
  }

  async listBankDestination(
    data: ListCustomersBankDto,
    customer_id: string,
  ): Promise<any> {
    const customerBank = await this.customerBankRepository
      .findListCustomersBank(data, customer_id)
      .catch(async (err3) => {
        console.error(err3);
        throw await this.responseService.httpExceptionHandling(
          customer_id,
          'customer_id',
          'general.general.dataNotFound',
          404,
        );
      });
    if (!customerBank) {
      throw await this.responseService.httpExceptionHandling(
        customer_id,
        'customer_id',
        'general.general.dataNotFound',
        404,
      );
    }
    return customerBank;
  }
}
