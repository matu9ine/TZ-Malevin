import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('work_types')
export class WorkType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name: string;
}
