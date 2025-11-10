import { Exclude, Expose, Type } from 'class-transformer';
import { RoleWithPermissionsDto } from 'src/modules/roles-permissions/dto/role.dto';
import { UserDto } from 'src/modules/users/dto/user.dto';

@Exclude()
export class GetMeResponseDto extends UserDto {
  @Expose()
  @Type(() => RoleWithPermissionsDto)
  role: RoleWithPermissionsDto;
}
