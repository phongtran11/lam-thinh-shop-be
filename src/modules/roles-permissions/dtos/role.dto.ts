import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PermissionDto } from 'src/modules/roles-permissions/dtos/permission.dto';
import { ROLES, type Roles } from 'src/shared/constants/role.constant';
import { BaseResponse } from 'src/shared/dtos/response.dto';

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
