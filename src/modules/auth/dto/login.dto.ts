import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class LoginDto {
  @ApiProperty({
    example: 'admin@gmail.com',
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
