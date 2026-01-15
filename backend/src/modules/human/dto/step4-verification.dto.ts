import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class Step4VerificationDto {
  @ApiProperty({ example: '123456789012', description: 'Civil ID number' })
  @IsString()
  @MaxLength(30)
  civilId!: string;

  @ApiProperty({ example: 'AB1234567', description: 'Passport ID (for non-Kuwaiti)', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  passportId?: string;

  @ApiProperty({ example: 'KW', description: 'Country (2-letter code)', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  countryList?: string;

  @ApiProperty({ example: 'National Bank of Kuwait', description: 'Bank name' })
  @IsString()
  @MaxLength(100)
  bankName!: string;

  @ApiProperty({ example: 'Kuwait City Branch', description: 'Bank address', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  bankAddress?: string;

  @ApiProperty({ example: 'John Doe', description: 'Account holder name' })
  @IsString()
  @MaxLength(100)
  accountHolderName!: string;

  @ApiProperty({ example: '123 Main St, Kuwait', description: 'Account holder address', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  accountHolderAddress?: string;

  @ApiProperty({
    example: 'KW81CBKU0000000000001234560101',
    description: 'IBAN number',
  })
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value?.replace(/\s/g, '').toUpperCase())
  @Matches(/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/, {
    message: 'Invalid IBAN format',
  })
  accountNumberIBAN!: string;

  @ApiProperty({ example: 'NABORKKW', description: 'SWIFT/BIC code', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  swiftNumber?: string;
}
