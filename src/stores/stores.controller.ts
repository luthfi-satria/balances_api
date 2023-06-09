import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { AuthJwtGuard } from 'src/auth/auth.decorator';
import { UserType } from 'src/auth/guard/user-type.decorator';
import { MessageService } from 'src/message/message.service';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { RSuccessMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import {
  ListStoresBalancesDto,
  ListStoresDto,
  StoreDisbursementBulkDto,
  StoreDisbursementDto,
} from './dto/stores_balance.dto';
import { StoresService } from './stores.service';

@Controller('api/v1/balances')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  @Get('stores/histories')
  @UserType('admin', 'merchant')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async listStoreBalanceHistories(
    @Query() data: ListStoresBalancesDto,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    const result = await this.storesService.listStoresBalanceHistories(
      data,
      req.user,
    );
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Get('stores/histories/:hid')
  @UserType('admin', 'merchant')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async detailStoreBalanceHistories(
    @Query() query: any,
    @Param('hid') store_history_id: string,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    const result = await this.storesService.detailStoresBalanceHistories(
      store_history_id,
      req.user,
      query?.unmask?.toUpperCase() === 'TRUE',
    );
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Get('stores/:sid')
  @UserType('admin', 'merchant')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async detailStoreBalance(
    @Param('sid') store_id: string,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    const result = await this.storesService.detailStoreBalance(
      store_id,
      req.user,
    );
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Get('stores')
  @UserType('admin', 'merchant')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async listStoreBalance(
    @Query() data: ListStoresDto,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    const result = await this.storesService.listStoresBalance(data, req.user);
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Get('stores/disbursements/scheduler')
  @ResponseStatusCode()
  async listStoreBalanceScheduler(): Promise<RSuccessMessage> {
    const result = await this.storesService.storeDisbursementScheduler();
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Post('stores/disbursements/:sid')
  @UserType('admin', 'merchant')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async disbursementStore(
    @Body() data: StoreDisbursementDto,
    @Param('sid') store_id: string,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    const result = await this.storesService.storeDisbursementValidation(
      data,
      store_id,
      req.user,
    );
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Post('stores/disbursements')
  @UserType('admin')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async disbursementStoreBulk(
    @Body() data: StoreDisbursementBulkDto,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    const result = await this.storesService.storeDisbursementValidationBulk(
      data,
      req.user,
    );
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }
}
