import { Exclude, Expose, Type } from 'class-transformer';
import { RoleWithPermissionsDto } from 'src/modules/roles-permissions/dtos/role.dto';
import { UserDto } from 'src/modules/users/dtos/user.dto';

@Exclude()
export class GetMeResponseDto extends UserDto {
  @Expose()
  @Type(() => RoleWithPermissionsDto)
  role: RoleWithPermissionsDto;
}
