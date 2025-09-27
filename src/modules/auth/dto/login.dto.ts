import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { UserDto } from 'src/modules/users/dto/user.response.dto';

@Exclude()
export class LoginDto {
  @ApiProperty({
    example: 'john_doe',
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

  @Expose()
  user: UserDto;
}
