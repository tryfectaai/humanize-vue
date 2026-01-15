import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class Step2ModelingDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of modeling type IDs',
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Select at least one modeling type' })
  @IsNumber({}, { each: true })
  @Type(() => Number)
  modelingTypes!: number[];

  @ApiProperty({
    example: [1, 2],
    description: 'Array of production type IDs',
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  productionTypes?: number[];

  @ApiProperty({
    example: [1],
    description: 'Array of preference IDs',
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  preferences?: number[];

  @ApiProperty({ example: 170, description: 'Height ID from conf_height table', required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  heightId?: number;

  @ApiProperty({ example: true, description: 'Has modeled before' })
  @IsBoolean()
  @Type(() => Boolean)
  modelBefore!: boolean;

  @ApiProperty({ example: 50.0, description: 'Hourly rate in KWD' })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Type(() => Number)
  price!: number;

  @ApiProperty({ example: 'Music video', description: 'Other modeling experience', required: false })
  @IsString()
  @IsOptional()
  otherModeling?: string;

  @ApiProperty({ example: 'Live streaming', description: 'Other production type', required: false })
  @IsString()
  @IsOptional()
  otherProduction?: string;

  @ApiProperty({ example: 'Night shoots', description: 'Other preference', required: false })
  @IsString()
  @IsOptional()
  otherPreference?: string;
}
