import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';
import {
  PaginationRequestDto,
  PaginationResponseDto,
} from 'src/shared/dto/paginate.dto';
import { IsOptional, IsString } from 'class-validator';

export class ListUserQueryParamsDto extends PaginationRequestDto {
  @ApiPropertyOptional({
    example: 'john',
  })
  @IsString()
  @IsOptional()
  search?: string;
}

@Exclude()
export class ListUserDto extends PaginationResponseDto {
  @Expose()
  @ApiProperty({ type: [UserDto] })
  @Type(() => UserDto)
  items: UserDto[];
}
