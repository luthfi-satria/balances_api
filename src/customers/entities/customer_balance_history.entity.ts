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
import { CustomerBankDocument } from './customer_bank.entity';

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

  @Column({ nullable: true })
  order_id: string;

  @Column({ nullable: true })
  voucher_package_order_id: string;

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

  @Column({ nullable: true, type: 'timestamptz' })
  eligible_at: Date | string;

  @ManyToOne(() => CustomerBankDocument, (cb) => cb.customer_balance_history, {
    eager: true,
  })
  @JoinColumn({ name: 'customer_bank_id', referencedColumnName: 'id' })
  customer_bank: CustomerBankDocument;

  // @OneToMany(
  //   () => CustomerDisbursementHistoryDocument,
  //   (history) => history.customer_balance_history,
  // )
  // customer_disbursement_history: CustomerDisbursementHistoryDocument[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ nullable: true, select: false })
  deleted_at: Date;
}
