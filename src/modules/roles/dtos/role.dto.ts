import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PermissionDto } from 'src/modules/permissions/dtos/permission.dto';
import { BaseResponse } from 'src/shared/dtos/response.dto';
import { ROLES } from '../constants/role.constant';
import { type Roles } from '../types/role.type';

@Exclude()
export class RoleRequestDto {
  @Expose()
  @ApiProperty({ enum: ROLES, example: ROLES.ADMIN })
  @IsEnum(ROLES)
  name: Roles;

  @Expose()
  @ApiProperty({
    example: 'Staff',
  })
  @IsString()
  displayName: string;

  @Expose()
  @ApiPropertyOptional({
    example: 'Role for staff members',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Expose()
  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
  })
  @IsOptional()
  @IsString({ each: true })
  permissions?: string[];
}

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
