import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiInternalServerErrorResponseCustom,
  ApiResponseOkCustom,
} from 'src/shared/decorators/swagger.decorator';
import { RoleWithPermissionsDto } from '../dtos/role.dto';
import { RoleService } from '../services/role.service';

@ApiTags('Roles')
@Controller('roles')
@ApiBadRequestResponseCustom()
@ApiInternalServerErrorResponseCustom()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Public()
  @ApiResponseOkCustom(RoleWithPermissionsDto)
  async getRoles(): Promise<RoleWithPermissionsDto[]> {
    return this.roleService.getRoles();
  }
}
