import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'john_doe_updated' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ required: false, example: 'new_password' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false, example: 'john.doe.updated@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
}
