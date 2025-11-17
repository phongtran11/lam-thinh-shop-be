import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from 'src/modules/roles-permissions/dtos/role.dto';
import { BaseResponse } from 'src/shared/dto/response.dto';

@Exclude()
export class UserDto extends BaseResponse {
  @Expose()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'John' })
  firstName: string;

  @Expose()
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @Expose()
  @ApiProperty({ example: '+84901234567' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ example: 'avatar.jpg' })
  avatar: string;

  @Expose()
  @ApiProperty({ example: 'fcdbf758-3eb3-429a-b1c3-1234567890ab' })
  roleId: string;
}

@Exclude()
export class UserWithRoleDto extends UserDto {
  @Expose()
  @ApiProperty({ type: RoleDto })
  @Type(() => RoleDto)
  role: RoleDto;
}
