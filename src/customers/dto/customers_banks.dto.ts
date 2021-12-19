import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class AddCustomerBankDto {
  @IsNotEmpty()
  disbursement_method_id: string;

  @IsNotEmpty()
  @IsNumberString()
  account_no: string;

  @IsNotEmpty()
  account_name: string;
}

export class UpdateCustomerBankDto {
  @IsOptional()
  disbursement_method_id: string;

  @IsOptional()
  @ValidateIf((o) => o.account_no)
  @IsNumberString()
  account_no: string;

  @IsOptional()
  account_name: string;
}

export class ListCustomersBankDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page: number;
}
