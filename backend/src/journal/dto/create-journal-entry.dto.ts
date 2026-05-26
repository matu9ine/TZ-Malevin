import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJournalEntryDto {
  @ApiProperty({ example: '2024-03-15', description: 'Дата выполнения работ' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 1, description: 'ID вида работ из справочника' })
  @IsNumber()
  @IsPositive()
  workTypeId: number;

  @ApiProperty({ example: 24.5, description: 'Объём выполненных работ' })
  @IsNumber()
  @IsPositive()
  volume: number;

  @ApiProperty({ example: 'м³', description: 'Единица измерения', maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit: string;

  @ApiProperty({ example: 'Иванов И.И.', description: 'ФИО исполнителя', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  executor: string;
}
