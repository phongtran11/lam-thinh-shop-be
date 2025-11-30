import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseResponse,
  PaginationRequestDto,
  PaginationResponseDto,
} from 'src/shared';
import { Trim } from 'src/shared/decorators';

@Exclude()
export class GetCustomersQueryDto extends PaginationRequestDto {
  @ApiProperty({
    description: 'Keyword to search customers',
    example: 'john',
    required: false,
  })
  @Expose()
  @Trim()
  keyword?: string;
}

@Exclude()
export class GetCustomerItemDto extends BaseResponse {
  @Expose()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'John' })
  firstName: string;

  @Expose()
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @Expose()
  @ApiProperty({ example: '+84901234567' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ example: 'avatar.jpg' })
  avatar: string;
}

@Exclude()
export class GetCustomersListDto extends PaginationResponseDto {
  @Expose()
  @ApiProperty({ type: [GetCustomerItemDto] })
  @Type(() => GetCustomerItemDto)
  items: GetCustomerItemDto[];
}
