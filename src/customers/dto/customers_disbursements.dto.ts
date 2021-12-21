import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class AddCustomerDisbursementDto {
  @IsNotEmpty()
  customer_bank_id: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class ValidateCustomerDisbursementDto {
  @IsNotEmpty()
  customer_bank_id: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumberString()
  otp_code: string;
}
