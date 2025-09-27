import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { Match } from 'src/shared/decorators/match.decorator';
import { Trim } from 'src/shared/decorators/trim.decorator';

@Exclude()
export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    required: true,
  })
  @Expose()
  @Trim()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    required: true,
  })
  @Expose()
  @Trim()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'password123',
    required: true,
  })
  @Expose()
  @Trim()
  @Match('password', { message: 'Passwords do not match' })
  @IsString()
  @IsNotEmpty()
  passwordConfirm: string;

  @ApiProperty({
    example: 'John',
    required: true,
  })
  @Expose()
  @Trim()
  @IsString()
  @Length(1, 64)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
  })
  @Expose()
  @Trim()
  @IsString()
  @Length(1, 64)
  lastName: string;

  @ApiProperty({
    example: '+84312456789',
    required: true,
  })
  @Expose()
  @IsPhoneNumber('VI', {
    
  })
  @Length(9, 20)
  phoneNumber: string;
}
