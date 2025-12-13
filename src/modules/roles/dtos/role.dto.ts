import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PermissionDto } from 'src/modules/permissions/dtos/permission.dto';
import { BaseResponse } from 'src/shared/dtos/response.dto';
import { ROLES } from '../constants/role.constant';
import { type Roles } from '../types/role.type';

@Exclude()
export class RoleDto extends BaseResponse {
  @Expose()
  @ApiProperty({ enum: ROLES, example: ROLES.ADMIN })
  name: Roles;

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
}

@Exclude()
export class RoleWithPermissionsDto extends RoleDto {
  @Expose()
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
