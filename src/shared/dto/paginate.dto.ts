import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, IsNumber, Min } from 'class-validator';

@Exclude()
export class PaginationResponseDto {
  @Expose()
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  page: number = 1;

  @Expose()
  @ApiProperty({
    example: 10,
  })
  @Type(() => Number)
  limit: number = 10;

  @Expose()
  @ApiProperty({
    example: 100,
  })
  @Type(() => Number)
  totalItem: number = 0;
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
  limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
