import { Exclude, Expose, Type } from 'class-transformer';
import { PermissionDto } from 'src/modules/roles-permissions/dtos/permission.dto';
import { RoleDto } from 'src/modules/roles-permissions/dtos/role.dto';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import { TokenDto } from './token.dto';

@Exclude()
export class AuthRoleDto extends RoleDto {
  @Expose()
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}

@Exclude()
export class AuthUserResDto extends UserDto {
  @Expose()
  @Type(() => AuthRoleDto)
  role: AuthRoleDto;
}

@Exclude()
export class AuthResDto extends TokenDto {
  @Expose()
  @Type(() => AuthUserResDto)
  user: AuthUserResDto;
}
