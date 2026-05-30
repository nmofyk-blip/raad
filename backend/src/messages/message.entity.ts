 import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @Column({ nullable: true })
  customerId: string;

  @Column({ nullable: true })
  orderId: string;

  @Column()
  phone: string;

  @Column('text')
  content: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  sentAt: Date;

  @Column({ default: 'whatsapp' })
  channel: string;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
