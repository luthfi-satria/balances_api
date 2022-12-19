import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoreDisbursementHistoryDocument } from './store_disbursement_history.entity';

export enum StoreTransactionType {
  REFUND = 'REFUND',
  BALANCE = 'BALANCE',
  DISBURSEMENT = 'DISBURSEMENT',
}

export enum StoreTransactionStatus {
  INPROCESS = 'INPROCESS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity({ name: 'balances_store_balance_history' })
@Index('IDX_rel_pencairan_saldo', [
  'group_id',
  'merchant_id',
  'store_id',
  'recorded_at',
  'type',
  'status',
])
@Index('IDX_disbursement_group_type_status', ['group_id', 'type', 'status'])
@Index('IDX_disbursement_merchants_type_status', [
  'merchant_id',
  'type',
  'status',
])
@Index('IDX_disbursement_stores_type_status', ['store_id', 'type', 'status'])
@Index('IDX_disbursement_default', ['recorded_at', 'type', 'status'])
export class StoreBalanceHistoryDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  order_id: string;

  @Column({ nullable: true })
  group_id: string;

  @Column({ nullable: true })
  merchant_id: string;

  @Column()
  store_id: string;

  @Column({
    type: 'enum',
    enum: StoreTransactionType,
    nullable: true,
  })
  type: StoreTransactionType;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: StoreTransactionStatus,
    nullable: true,
  })
  status: StoreTransactionStatus;

  @Column({ nullable: true, type: 'timestamptz' })
  recorded_at: Date | string;

  @Column({ nullable: true, type: 'timestamptz' })
  eligible_at: Date | string;

  @Column({ nullable: true })
  disbursement_method_id: string;

  @Column({ nullable: true })
  account_no: string;

  @Column({ nullable: true })
  account_name: string;

  @OneToMany(
    () => StoreDisbursementHistoryDocument,
    (history) => history.store_balance_history,
    { eager: true },
  )
  histories: StoreDisbursementHistoryDocument[];

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  created_by_type: string;

  disbursement_method: any;
  store: any;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ nullable: true, select: false })
  deleted_at: Date;
}
