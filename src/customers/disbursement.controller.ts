import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthJwtGuard } from 'src/auth/auth.decorator';
import { UserType } from 'src/auth/guard/user-type.decorator';
import { MessageService } from 'src/message/message.service';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { RSuccessMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import {
  AddCustomerDisbursementDto,
  ValidateCustomerDisbursementDto,
} from './dto/customers_disbursements.dto';
import { DisbursementService } from './disbursement.service';

@Controller('api/v1/balances')
export class DisbursementController {
  constructor(
    private readonly disbursementService: DisbursementService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  @Post('customers/disbursements')
  @UserType('customer')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async disbursements(
    @Body() data: AddCustomerDisbursementDto,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    return this.disbursementService.disbursement(data, req.user.id);
  }

  @Post('customers/disbursements/otp-validation')
  @UserType('customer')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async disbursementsValidation(
    @Body() data: ValidateCustomerDisbursementDto,
    @Req() req: any,
  ): Promise<RSuccessMessage> {
    return this.disbursementService.disbursementValidation(data, req.user.id);
  }
}
