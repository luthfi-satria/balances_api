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
import { CustomerBalanceHistoryDocument } from './customer_balance_history.entity';

export enum DisbursementTransactionStatus {
  INPROCESS = 'INPROCESS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity({ name: 'balances_customer_disbursement_history' })
export class CustomerDisbursementHistoryDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CustomerBalanceHistoryDocument, {
    eager: true,
  })
  @JoinColumn({
    name: 'customer_balance_history_id',
    referencedColumnName: 'id',
  })
  customer_balance_history: CustomerBalanceHistoryDocument;

  @Column({
    type: 'enum',
    enum: DisbursementTransactionStatus,
    nullable: true,
  })
  status: DisbursementTransactionStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ nullable: true, select: false })
  deleted_at: Date;
}
