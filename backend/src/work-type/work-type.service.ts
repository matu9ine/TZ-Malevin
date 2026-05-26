import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkType } from './work-type.entity';

const SEED_WORK_TYPES = [
  'Кладка перегородок',
  'Монтаж опалубки',
  'Бетонирование',
  'Армирование',
  'Штукатурные работы',
  'Малярные работы',
  'Электромонтажные работы',
  'Сантехнические работы',
  'Монтаж кровли',
  'Земляные работы',
];

@Injectable()
export class WorkTypeService implements OnModuleInit {
  constructor(
    @InjectRepository(WorkType)
    private readonly repo: Repository<WorkType>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      const entities = SEED_WORK_TYPES.map((name) => this.repo.create({ name }));
      await this.repo.save(entities);
    }
  }

  findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }
}
