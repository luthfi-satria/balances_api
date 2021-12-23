import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export enum EligibleDisburseAtValues {
  INSTANTLY = 'INSTANTLY',
  D_PLUS_1 = 'D_PLUS_1',
  D_PLUS_2 = 'D_PLUS_2',
  D_PLUS_3 = 'D_PLUS_3',
}
export enum AutomaticDisburseAtValues {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  DATE = 'DATE',
}
export enum AutomaticDisburseDayValues {
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
  SUN = 'SUN',
}

export class SettingsDto {
  @IsOptional()
  @IsIn(Object.values(EligibleDisburseAtValues))
  eligible_disburse_at: EligibleDisburseAtValues;

  @IsOptional()
  @IsNumber()
  @Min(1)
  eligible_disburse_min_amount: number;

  @IsOptional()
  @IsIn(Object.values(AutomaticDisburseAtValues))
  automatic_disburse_at: AutomaticDisburseAtValues;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  automatic_disburse_day: AutomaticDisburseDayValues[];

  @IsOptional()
  automatic_disburse_date: number[];

  @IsOptional()
  automatic_disburse_time: string[];
}
