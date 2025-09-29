import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Permission } from '../entities/permission.entity';
import { RoleEnum as RoleEnum } from 'src/shared/enums/roles.enum';
import { Exclude, Expose, Type } from 'class-transformer';
import { BaseResponse } from 'src/shared/dto/response.dto';

@Exclude()
export class RoleResponseDto extends BaseResponse {
  @Expose()
  @ApiProperty({ enum: RoleEnum, example: RoleEnum.STAFF })
  name: RoleEnum;

  @Expose()
  @ApiProperty({
    example: 'Staff',
  })
  displayName: string;

  @Expose()
  @ApiPropertyOptional({
    example: 'Role for staff members',
  })
  description?: string;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  level: number;

  @Expose()
  @ApiProperty({ type: () => Permission, isArray: true })
  @Type(() => Permission)
  permissions: Permission[];
}
