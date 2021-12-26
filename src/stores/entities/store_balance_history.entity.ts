import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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
  )
  histories: StoreDisbursementHistoryDocument[];

  disbursement_method: any;
  store: any;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ nullable: true, select: false })
  deleted_at: Date;
}
