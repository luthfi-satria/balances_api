import { Controller, Get, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('api/v1/balances')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('customers/histories')
  // @UserType('admin', 'merchant')
  // @AuthJwtGuard()
  // @ResponseStatusCode()
  async listCustomerBalanceHistories(
    @Query() data: any,
    // @Req() req: any,
  ): Promise<any> {
    console.log('data ', data);
    return this.customersService.listCustomerBalanceHistories(data);
    // return this.responseService.success(
    //   true,
    //   this.messageService.get('general.general.success'),
    //   result,
    // );
  }
}
