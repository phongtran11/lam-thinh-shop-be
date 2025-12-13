import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from 'src/shared/decorators/match.decorator';

export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'password123',
    required: true,
  })
  @Match('password', { message: 'Passwords do not match' })
  @IsString()
  @IsNotEmpty()
  passwordConfirm: string;

  @ApiProperty({
    example: 'John',
    required: true,
  })
  @IsString()
  @Length(1, 64)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
  })
  @IsString()
  @Length(1, 64)
  lastName: string;

  @ApiProperty({
    example: '+84901234567',
    required: true,
  })
  @IsNumberString()
  @Length(9, 20)
  phoneNumber: string;
}
