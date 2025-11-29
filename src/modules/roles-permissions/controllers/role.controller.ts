import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleWithPermissionsDto } from 'src/modules/roles-permissions/dtos/role.dto';
import { RoleService } from 'src/modules/roles-permissions/services/role.service';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiInternalServerErrorResponseCustom,
  ApiResponseOkCustom,
} from 'src/shared/decorators/swagger.decorator';

@ApiTags('Roles')
@Controller('roles')
@ApiBadRequestResponseCustom()
@ApiInternalServerErrorResponseCustom()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Public()
  @ApiResponseOkCustom(RoleWithPermissionsDto, {
    isArray: true,
  })
  async getRoles(): Promise<RoleWithPermissionsDto[]> {
    return this.roleService.getRoles();
  }
}
