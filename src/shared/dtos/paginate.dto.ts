import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PaginationResponseDto {
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

export class PaginationRequestDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Expose()
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page for pagination',
    example: 10,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Expose()
  limit: number = 10;

  get skip(): number {
    if (this.limit > 100) {
      return (this.page - 1) * 100;
    }

    return (this.page - 1) * this.limit;
  }

  get take(): number {
    if (this.limit > 100) {
      return 100;
    }

    return this.limit;
  }
}
