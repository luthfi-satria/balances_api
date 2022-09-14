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
  @IsDate()
  date_start: Date;

  @IsOptional()
  @IsDate()
  date_end: Date;

  @IsOptional()
  @IsString()
  status: string;
}
