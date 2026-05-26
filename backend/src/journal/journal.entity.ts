import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkType } from '../work-type/work-type.entity';

@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @ManyToOne(() => WorkType, { eager: true })
  @JoinColumn({ name: 'work_type_id' })
  workType: WorkType;

  @Column({ name: 'work_type_id' })
  workTypeId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  volume: number;

  @Column({ length: 20 })
  unit: string;

  @Column({ length: 255 })
  executor: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
