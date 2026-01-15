import { IsString, IsOptional, IsUrl, IsEnum, MaxLength, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ProfileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export class Step3ProfileDto {
  @ApiProperty({
    example: 1,
    description: 'Job sector ID from conf_jobsector table (required)',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Job sector is required' })
  @Type(() => Number)
  jobSectorId!: number;

  @ApiProperty({
    example: 'Senior Software Engineer',
    description: 'Job title (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(120)
  jobTitle?: string;

  @ApiProperty({
    example: 'I am a professional model with 5 years of experience...',
    description: 'Brief introduction/bio',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  briefIntro?: string;

  @ApiProperty({
    example: 'public',
    enum: ProfileVisibility,
    description: 'Profile visibility',
  })
  @IsEnum(ProfileVisibility)
  @IsOptional()
  profileVisibility?: ProfileVisibility;

  @ApiProperty({
    example: 'https://twitter.com/johndoe',
    description: 'Twitter profile URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  twitterLink?: string;

  @ApiProperty({
    example: 'https://instagram.com/johndoe',
    description: 'Instagram profile URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  instagramLink?: string;

  @ApiProperty({
    example: 'https://facebook.com/johndoe',
    description: 'Facebook profile URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  facebookLink?: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Snapchat username',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  snapchatLink?: string;

  @ApiProperty({
    example: 'https://tiktok.com/@johndoe',
    description: 'TikTok profile URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  tiktokLink?: string;

  @ApiProperty({
    example: 'https://youtube.com/c/johndoe',
    description: 'YouTube channel URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  youtubeLink?: string;

  @ApiProperty({
    example: 1,
    description: 'Height ID from conf_height table',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  heightId?: number;
}
