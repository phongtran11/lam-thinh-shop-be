import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/shared/dto/response.dto';

@Exclude()
export class PermissionDto extends BaseResponse {
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
