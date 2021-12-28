import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoreBalanceHistoryDocument } from './store_balance_history.entity';

export enum StoreDisbursementTransactionStatus {
  INPROCESS = 'INPROCESS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity({ name: 'balances_store_disbursement_history' })
export class StoreDisbursementHistoryDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StoreBalanceHistoryDocument)
  @JoinColumn({
    name: 'store_balance_history_id',
    referencedColumnName: 'id',
  })
  store_balance_history: StoreBalanceHistoryDocument;

  @Column({
    type: 'enum',
    enum: StoreDisbursementTransactionStatus,
    nullable: true,
  })
  status: StoreDisbursementTransactionStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ nullable: true, select: false })
  deleted_at: Date;
}
