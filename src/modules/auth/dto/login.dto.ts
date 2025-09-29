import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

@Exclude()
export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    required: true,
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  password: string;
}
