import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import {
  PaginationRequestDto,
  PaginationResponseDto,
} from 'src/shared/dto/paginate.dto';

export class ListUserQueryParamsDto extends PaginationRequestDto {
  @ApiPropertyOptional({
    example: 'john',
  })
  @IsString()
  @IsOptional()
  keywords?: string;
}

@Exclude()
export class ListUserDto extends PaginationResponseDto {
  @Expose()
  @ApiProperty({ type: [UserDto] })
  @Type(() => UserDto)
  items: UserDto[];
}
