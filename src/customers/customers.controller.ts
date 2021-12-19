import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { AuthJwtGuard } from 'src/auth/auth.decorator';
import { UserType } from 'src/auth/guard/user-type.decorator';
import { MessageService } from 'src/message/message.service';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { RSuccessMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { CustomersService } from './customers.service';
import { ListCustomersBalancesDto } from './dto/customers_balance.dto';

@Controller('api/v1/balances')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  @Get('customers/histories')
  @UserType('customer')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async listCustomerBalanceHistories(
    @Query() data: ListCustomersBalancesDto,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    const result = await this.customersService.listCustomerBalanceHistories(
      data,
      req.user.id,
    );
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Get('customers')
  @UserType('customer')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async viewDetailCustomerBalance(@Req() req: any): Promise<RSuccessMessage> {
    const result = await this.customersService.detailCustomerBalance(
      req.user.id,
    );
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Get('admins/customers/histories/:cid')
  @UserType('admin')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async listCustomerBalanceHistoriesByAdmin(
    @Query() data: ListCustomersBalancesDto,
    @Param('cid') cid: string,
  ): Promise<RSuccessMessage> {
    const result = await this.customersService.listCustomerBalanceHistories(
      data,
      cid,
    );
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Get('admins/customers/:cid')
  @UserType('admin')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async viewDetailCustomerBalanceByAdmin(
    @Param('cid') cid: string,
  ): Promise<RSuccessMessage> {
    const result = await this.customersService.detailCustomerBalance(cid);
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }
}
