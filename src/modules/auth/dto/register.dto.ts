import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from 'src/shared/decorators/match.decorator';

@Exclude()
export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    required: true,
  })
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    required: true,
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'password123',
    required: true,
  })
  @Expose()
  @Match('password', { message: 'Passwords do not match' })
  @IsString()
  @IsNotEmpty()
  passwordConfirm: string;

  @ApiProperty({
    example: 'John',
    required: true,
  })
  @Expose()
  @IsString()
  @Length(1, 64)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
  })
  @Expose()
  @IsString()
  @Length(1, 64)
  lastName: string;

  @ApiProperty({
    example: '+84901234567',
    required: true,
  })
  @Expose()
  @IsNumberString()
  @Length(9, 20)
  phoneNumber: string;
}
