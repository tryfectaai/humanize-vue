import { IsEmail, IsString, MinLength, IsIn, Matches, IsNotEmpty, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Custom validator to check if passwords match
@ValidatorConstraint({ name: 'passwordsMatch', async: false })
export class PasswordsMatchConstraint implements ValidatorConstraintInterface {
  validate(password2: string, args: ValidationArguments) {
    const obj = args.object as RegisterDto;
    return password2 === obj.password1;
  }

  defaultMessage() {
    return 'Passwords do not match';
  }
}

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'Password123!', 
    description: 'Password (min 8 chars, 1 uppercase, 1 number, 1 special char)' 
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least 1 uppercase letter, 1 number, and 1 special character',
  })
  password1: string;

  @ApiProperty({ example: 'Password123!', description: 'Password confirmation' })
  @IsString()
  @MinLength(8)
  @Validate(PasswordsMatchConstraint)
  password2: string;

  @ApiProperty({ 
    example: 'human', 
    enum: ['human', 'humanize'],
    description: 'Account type: human (talent) or humanize (company)' 
  })
  @IsString()
  @IsIn(['human', 'humanize'])
  account_type: string;
}

export class RegisterResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: {
    id: number;
    email: string;
    name: string;
    accountType: string;
  };
}
