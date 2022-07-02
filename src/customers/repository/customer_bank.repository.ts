import { ListResponse } from 'src/response/response.interface';
import { EntityRepository, Repository } from 'typeorm';
import { ListCustomersBankDto } from '../dto/customers_banks.dto';
import { CustomerBankDocument } from '../entities/customer_bank.entity';

@EntityRepository(CustomerBankDocument)
export class CustomerBankRepository extends Repository<CustomerBankDocument> {
  constructor() {
    super();
  }

  async findListCustomersBank(
    data: ListCustomersBankDto,
    customer_id: string,
  ): Promise<ListResponse> {
    const currentPage: number = data.page || 1;
    const perPage: number = data.limit || 10;
    let totalItems = 0;

    const qList = this.createQueryBuilder()
      .where('customer_id = :cid', {
        cid: customer_id,
      })
      .orderBy('created_at', 'DESC')
      .skip((currentPage - 1) * perPage)
      .take(perPage);

    try {
      const resultList = await qList.getManyAndCount();
      totalItems = resultList[1];

      return {
        total_item: totalItems,
        limit: perPage,
        current_page: currentPage,
        items: resultList[0],
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
