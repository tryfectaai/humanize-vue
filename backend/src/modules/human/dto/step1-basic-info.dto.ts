import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  Matches,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class Step1BasicInfoDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the talent' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Profile name (unique, alphanumeric + underscore)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9_]+$/, {
    message: 'Profile name must contain only letters, numbers, and underscores',
  })
  profileName!: string;

  @ApiProperty({ example: '1995-05-15', description: 'Date of birth (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  dob!: string;

  @ApiProperty({ example: 'male', enum: Gender, description: 'Gender' })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: Gender;

  @ApiProperty({ example: 'KW', description: 'Nationality (2-letter country code)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  @MinLength(2)
  nationality!: string;

  @ApiProperty({ example: 'Kuwait City', description: 'Place of living (city or area name)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  placeOfLiving!: string;

  @ApiProperty({ example: '+96512345678', description: 'Phone number with country code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone!: string;

  @ApiProperty({ example: '123 Main St, Kuwait City', description: 'Address', required: false })
  @IsString()
  @IsOptional()
  address?: string;
}
