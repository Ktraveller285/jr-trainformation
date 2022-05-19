import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Notice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  noticeEmail: string;

  @Column()
  lineName: string;

  @Column()
  trainNumber: string;

  @Column()
  noticeDate: string;

  @Column()
  cancelDecisionTime: string;

  @Column({
    default: false,
  })
  notified: boolean;

  @Column()
  ipAddress: string;
}
