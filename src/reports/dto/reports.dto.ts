import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class exportExcelDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  group_id: string;

  @IsOptional()
  @IsString()
  merchant_id: string;

  @IsOptional()
  @IsString()
  store_id: string;

  @IsOptional()
  recorded_start: Date;

  @IsOptional()
  recorded_end: Date;

  @IsOptional()
  eligible_start: Date;

  @IsOptional()
  eligible_end: Date;

  @IsOptional()
  @IsString()
  status: string;
}
