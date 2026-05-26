import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntry } from './journal.entity';
import { JournalService } from './journal.service';
import { JournalController } from './journal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntry])],
  controllers: [JournalController],
  providers: [JournalService],
})
export class JournalModule {}
