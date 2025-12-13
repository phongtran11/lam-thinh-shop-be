import { Exclude, Expose, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DB_ORDERS, type DBOrders } from 'src/shared/constants/db.constant';
import {
  PaginatedRequestDto,
  PaginatedResponseDto,
} from 'src/shared/dtos/paginate.dto';
import { PermissionDto } from './permission.dto';

@Exclude()
export class PermissionFilterDto {
  @ApiPropertyOptional({
    example: 'products',
  })
  @IsOptional()
  @IsString()
  @Expose()
  name?: string;
}

@Exclude()
export class PermissionOrderDto {
  @ApiPropertyOptional({
    example: 'ASC',
  })
  @IsOptional()
  @IsEnum(DB_ORDERS)
  @Expose()
  name?: DBOrders;
}

@Exclude()
export class PermissionListingReqDto extends PaginatedRequestDto<
  PermissionFilterDto,
  PermissionOrderDto
> {
  @ApiPropertyOptional({
    example: 'Keyword',
  })
  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;

  @ApiPropertyOptional({
    type: PermissionFilterDto,
  })
  @Type(() => PermissionFilterDto)
  @ValidateNested()
  @Expose()
  filter?: PermissionFilterDto;

  @ApiPropertyOptional({
    type: PermissionOrderDto,
  })
  @Type(() => PermissionOrderDto)
  @ValidateNested()
  @Expose()
  order?: PermissionOrderDto;
}

export class PermissionListingDto extends PaginatedResponseDto<
  PermissionDto,
  PermissionFilterDto,
  PermissionOrderDto
> {
  @ApiProperty({
    type: [PermissionDto],
  })
  @Type(() => PermissionDto)
  items: PermissionDto[];
}
