import {
  IsArray,
  IsNumber,
  ArrayMinSize,
  IsBoolean,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Step 2: Interests Selection
 * 
 * This replaces the old "Modeling" step which had complex fields like:
 * - modelingTypes, productionTypes, preferences, height
 * 
 * Now it's simplified to:
 * - interests selection
 * - modelBefore (have you modeled before?)
 * - price (hourly rate in KWD)
 * - otherModeling (optional other experience)
 */
export class Step2InterestsDto {
  @ApiProperty({
    example: [1, 2, 3, 5],
    description: 'Array of interest IDs from conf_interest table',
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Select at least one interest' })
  @IsNumber({}, { each: true })
  @Type(() => Number)
  interests!: number[];

  @ApiProperty({
    example: false,
    description: 'Has the user modeled before?',
  })
  @IsBoolean()
  @Type(() => Boolean)
  modelBefore!: boolean;

  @ApiProperty({
    example: 10,
    description: 'Hourly rate in KWD',
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @ApiProperty({
    example: 'Music videos, theatre',
    description: 'Other modeling/creative experience (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  otherModeling?: string;
}
