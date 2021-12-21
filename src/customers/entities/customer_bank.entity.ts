import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerBalanceHistoryDocument } from './customer_balance_history.entity';

@Entity({ name: 'balances_customer_bank' })
export class CustomerBankDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customer_id: string;

  @Column()
  disbursement_method_id: string;

  @Column()
  account_no: string;

  @Column()
  account_name: string;

  @OneToMany(
    () => CustomerBalanceHistoryDocument,
    (history) => history.customer_bank,
  )
  customer_balance_history: CustomerBalanceHistoryDocument[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date | string;

  @DeleteDateColumn({ nullable: true, select: false })
  deleted_at: Date;
}
