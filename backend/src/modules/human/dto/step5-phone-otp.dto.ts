import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Language {
  EN = 'en',
  AR = 'ar',
}

export class SendOtpDto {
  @ApiProperty({ example: '+96512345678', description: 'Phone number with country code' })
  @IsString()
  @IsNotEmpty()
  mobileNumber!: string;

  @ApiProperty({ 
    example: 'en', 
    enum: Language, 
    description: 'Language for SMS message (en or ar)',
    required: false,
  })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+96512345678', description: 'Phone number with country code' })
  @IsString()
  @IsNotEmpty()
  mobileNumber!: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  @Matches(/^[0-9]+$/, { message: 'OTP must contain only numbers' })
  code!: string;
}
