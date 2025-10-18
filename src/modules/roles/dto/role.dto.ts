import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEnum as RoleEnum } from 'src/shared/enums/roles.enum';
import { Exclude, Expose, Type } from 'class-transformer';
import { BaseResponse } from 'src/shared/dto/response.dto';
import { PermissionDto } from './permission.dto';

@Exclude()
export class RoleDto extends BaseResponse {
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
}

@Exclude()
export class RoleWithPermissionsDto extends RoleDto {
  @Expose()
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
