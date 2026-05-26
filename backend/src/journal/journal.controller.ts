import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JournalService } from './journal.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { QueryJournalDto } from './dto/query-journal.dto';

@ApiTags('journal')
@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список записей с пагинацией и фильтрами' })
  @ApiResponse({ status: 200, description: 'Список записей' })
  findAll(@Query() query: QueryJournalDto) {
    return this.journalService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить запись по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Запись найдена' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.journalService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новую запись' })
  @ApiResponse({ status: 201, description: 'Запись создана' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  create(@Body() dto: CreateJournalEntryDto) {
    return this.journalService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить запись' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Запись обновлена' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJournalEntryDto,
  ) {
    return this.journalService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить запись' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Запись удалена' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.journalService.remove(id);
  }
}
