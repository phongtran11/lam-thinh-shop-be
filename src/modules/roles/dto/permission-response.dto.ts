import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { BaseResponse } from 'src/shared/dto/response.dto';

@Exclude()
export class PermissionResponseDto extends BaseResponse {
  @Expose()
  @ApiProperty({
    example: 'products:create',
  })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'Create Product',
  })
  displayName: string;

  @Expose()
  @ApiProperty({
    example: 'Permission to create a new product',
  })
  description: string;

  @Expose()
  @ApiProperty({
    example: 'products',
  })
  resource: string;

  @Expose()
  @ApiProperty({
    example: true,
  })
  isActive: boolean;
}
