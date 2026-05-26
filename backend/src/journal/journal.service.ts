import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from './journal.entity';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { QueryJournalDto } from './dto/query-journal.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class JournalService {
  private readonly logger = new Logger(JournalService.name);

  constructor(
    @InjectRepository(JournalEntry)
    private readonly repo: Repository<JournalEntry>,
  ) {}

  async findAll(query: QueryJournalDto): Promise<PaginatedResponse<JournalEntry>> {
    const { page, limit, dateFrom, dateTo, sort } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.workType', 'workType')
      .orderBy('entry.date', sort || 'DESC')
      .skip(skip)
      .take(limit);

    if (dateFrom) {
      qb.andWhere('entry.date >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      qb.andWhere('entry.date <= :dateTo', { dateTo });
    }

    const [data, total] = await qb.getManyAndCount();

    this.logger.debug(`Found ${total} entries (page ${page}, limit ${limit})`);

    return new PaginatedResponse(data, total, page, limit);
  }

  async findOne(id: number): Promise<JournalEntry> {
    const entry = await this.repo.findOne({
      where: { id },
      relations: ['workType'],
    });
    if (!entry) {
      throw new NotFoundException(`Запись #${id} не найдена`);
    }
    return entry;
  }

  async create(dto: CreateJournalEntryDto): Promise<JournalEntry> {
    const entry = this.repo.create(dto);
    const saved = await this.repo.save(entry);
    this.logger.log(`Created entry #${saved.id}`);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateJournalEntryDto): Promise<JournalEntry> {
    const entry = await this.findOne(id);
    Object.assign(entry, dto);
    await this.repo.save(entry);
    this.logger.log(`Updated entry #${id}`);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ deleted: true; id: number }> {
    const entry = await this.findOne(id);
    await this.repo.remove(entry);
    this.logger.log(`Deleted entry #${id}`);
    return { deleted: true, id };
  }
}
