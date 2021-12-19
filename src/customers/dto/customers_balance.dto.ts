import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ListCustomersBalancesDto {
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
}
