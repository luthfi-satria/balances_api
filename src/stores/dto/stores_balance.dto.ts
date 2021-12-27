import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  isNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import {
  StoreTransactionStatus,
  StoreTransactionType,
} from '../entities/store_balance_history.entity';

export class ListStoresBalancesDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page: number;

  @IsOptional()
  date_range_start: string;

  @IsOptional()
  date_range_end: string;

  @IsOptional()
  group_id: string;

  @IsOptional()
  merchant_id: string;

  @IsOptional()
  store_id: string;

  @IsOptional()
  @ValidateIf((o) => o.type !== '')
  @IsIn(Object.values(StoreTransactionType))
  type: StoreTransactionType;

  @IsOptional()
  @IsArray()
  @IsIn(Object.values(StoreTransactionStatus), { each: true })
  statuses: StoreTransactionStatus[];
}

export class ListStoresDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @ValidateIf((o) => isNotEmpty(o))
  group_id: string;

  @IsOptional()
  @ValidateIf((o) => isNotEmpty(o))
  merchant_id: string;

  @IsOptional()
  @ValidateIf((o) => isNotEmpty(o))
  store_id: string;
}

export class StoreDisbursementDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  notes: string;
}
