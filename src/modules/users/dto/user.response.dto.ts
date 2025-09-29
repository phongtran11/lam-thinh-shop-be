import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { RoleResponseDto } from 'src/modules/roles/dto/role-response.dto';
import { BaseResponse } from 'src/shared/dto/response.dto';
import { RoleEnum } from 'src/shared/enums/roles.enum';

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
  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  avatar: string;

  @Expose()
  @ApiProperty({ enum: RoleEnum, example: RoleEnum.STAFF })
  roleName: RoleEnum;
}

@Exclude()
export class UserWithRolePermissionsDto extends UserDto {
  @Expose()
  @ApiProperty({
    type: RoleResponseDto,
  })
  @Type(() => RoleResponseDto)
  role: RoleResponseDto;
}
