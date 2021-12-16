import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ListCustomersBalanceHistoriesDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page: number;

  // @IsNotEmpty()
  // @IsDateString()
  // @IsOptional()
  // @Type(() => String)
  // date_range_start?: any;

  // @IsNotEmpty()
  // @IsDateString()
  // @IsOptional()
  // @Type(() => String)
  // date_range_end?: any;
}
