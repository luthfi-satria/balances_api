import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AuthJwtGuard } from 'src/auth/auth.decorator';
import { UserType } from 'src/auth/guard/user-type.decorator';
import { MessageService } from 'src/message/message.service';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { RSuccessMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { BanksService } from './banks.service';
import {
  AddCustomerBankDto,
  ListCustomersBankDto,
  UpdateCustomerBankDto,
} from './dto/customers_banks.dto';

@Controller('api/v1/balances')
export class BanksController {
  constructor(
    private readonly banksService: BanksService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  @Post('customers/banks')
  @UserType('customer')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async addBankDestination(
    @Body() data: AddCustomerBankDto,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    const result = await this.banksService.addBankDestination(
      data,
      req.user.id,
    );
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Put('customers/banks/:bid')
  @UserType('customer')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async updateBankDestination(
    @Body() data: UpdateCustomerBankDto,
    @Param('bid') bid: string,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    const result = await this.banksService.updateBankDestination(
      data,
      bid,
      req.user.id,
    );
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Delete('customers/banks/:bid')
  @UserType('customer')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async deleteBankDestination(
    @Param('bid') bid: string,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    await this.banksService.deleteBankDestination(bid, req.user.id);
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
    );
  }

  @Get('customers/banks/:bid')
  @UserType('customer')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async viewDetailBankDestination(
    @Param('bid') bid: string,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    const result = await this.banksService.viewDetailBankDestination(
      bid,
      req.user.id,
    );
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Get('customers/banks')
  @UserType('customer')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async listBankDestination(
    @Query() data: ListCustomersBankDto,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    const result = await this.banksService.listBankDestination(
      data,
      req.user.id,
    );
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }
}
