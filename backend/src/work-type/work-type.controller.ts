import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WorkTypeService } from './work-type.service';

@ApiTags('work-types')
@Controller('work-types')
export class WorkTypeController {
  constructor(private readonly workTypeService: WorkTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Получить справочник видов работ' })
  @ApiResponse({ status: 200, description: 'Список видов работ' })
  findAll() {
    return this.workTypeService.findAll();
  }
}
