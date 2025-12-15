import { Exclude, Expose, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DB_ORDERS, type DBOrders } from 'src/shared/constants/db.constant';
import {
  PaginatedRequestDto,
  PaginatedResponseDto,
} from 'src/shared/dtos/paginate.dto';
import { RoleDto } from './role.dto';

@Exclude()
export class RoleFilterDto {
  @ApiPropertyOptional({
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  @Expose()
  name?: string;
}

@Exclude()
export class RoleOrderDto {
  @ApiPropertyOptional({
    example: 'ASC',
  })
  @IsOptional()
  @IsEnum(DB_ORDERS)
  @Expose()
  name?: DBOrders;
}

@Exclude()
export class RoleListingReqDto extends PaginatedRequestDto<
  RoleFilterDto,
  RoleOrderDto
> {
  @ApiPropertyOptional({
    example: 'Keyword',
  })
  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;

  @ApiPropertyOptional({
    type: RoleFilterDto,
  })
  @Type(() => RoleFilterDto)
  @ValidateNested()
  @Expose()
  filter?: RoleFilterDto;

  @ApiPropertyOptional({
    type: RoleOrderDto,
  })
  @Type(() => RoleOrderDto)
  @ValidateNested()
  @Expose()
  order?: RoleOrderDto;
}

export class RoleListingDto extends PaginatedResponseDto<
  RoleDto,
  RoleFilterDto,
  RoleOrderDto
> {
  @ApiProperty({
    type: [RoleDto],
  })
  @Type(() => RoleDto)
  items: RoleDto[];
}
