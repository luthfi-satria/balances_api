import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TransactionType {
  REFUND = 'REFUND',
  DISBURSEMENT = 'DISBURSEMENT',
}

export enum TransactionStatus {
  INPROCESS = 'INPROCESS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity({ name: 'balances_customer_balance_history' })
export class CustomerBalanceHistoryDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order_id: string;

  @Column()
  customer_id: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: true,
  })
  type: TransactionType;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    nullable: true,
  })
  status: TransactionStatus;

  @Column({ nullable: true, type: 'timestamptz' })
  recorded_at: Date | string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ nullable: true, select: false })
  deleted_at: Date;
}
