import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';
import {
  PaginationRequestDto,
  PaginationResponseDto,
} from 'src/shared/dto/paginate.dto';

export class ListUserQueryParamsDto extends PaginationRequestDto {}

@Exclude()
export class ListUserDto extends PaginationResponseDto {
  @Expose()
  @ApiProperty({ type: [UserDto] })
  @Type(() => UserDto)
  items: UserDto[];
}
