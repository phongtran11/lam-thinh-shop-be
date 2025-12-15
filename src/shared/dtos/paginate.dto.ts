import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Exclude()
export class PaginatedMetaDto {
  constructor(query: { page: number; limit: number }, totalItem: number) {
    this.page = Number(query.page);
    this.limit = Number(query.limit);
    this.totalItem = totalItem;
    this.totalPage = Math.ceil(totalItem / this.limit);
  }

  @Expose()
  @ApiProperty({
    example: 1,
  })
  page: number;

  @Expose()
  @ApiProperty({
    example: 10,
  })
  limit: number;

  @Expose()
  @ApiProperty({
    example: 100,
  })
  totalItem: number;

  @Expose()
  @ApiProperty({
    example: 10,
  })
  totalPage: number;
}

@Exclude()
export abstract class PaginatedResponseDto<T, Filter, Order> {
  constructor(
    meta: PaginatedMetaDto,
    keyword?: string,
    filter?: Filter,
    order?: Order,
  ) {
    this.meta = meta;
    this.keyword = keyword;
    this.filter = filter;
    this.order = order;
  }

  @Expose()
  @ApiProperty({
    type: PaginatedMetaDto,
  })
  @Type(() => PaginatedMetaDto)
  meta: PaginatedMetaDto;

  @Expose()
  @ApiProperty({
    example: 'search keyword',
  })
  keyword?: string;

  @Expose()
  @ApiProperty({
    example: {},
  })
  filter?: Filter | object = {};

  @Expose()
  @ApiProperty({
    example: {},
  })
  order?: Order | object = {};

  abstract items: T[];
}

@Exclude()
export abstract class PaginatedRequestDto<Filter, Order> {
  @Expose()
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page: number = 1;

  @Expose()
  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsNumber()
  get skip(): number {
    if (this.limit > 100) {
      return (this.page - 1) * 100;
    }

    return (this.page - 1) * this.limit;
  }

  @IsOptional()
  @IsNumber()
  get take(): number {
    if (this.limit > 100) {
      return 100;
    }

    return this.limit;
  }

  abstract filter?: Filter;

  abstract order?: Order;

  abstract keyword?: string;
}
