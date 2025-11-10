import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiInternalServerErrorResponseCustom,
  ApiResponseCustom,
} from 'src/shared/decorators/swagger.decorator';
import { RoleWithPermissionsDto } from '../dto/role.dto';

@ApiTags('Roles')
@Controller('roles')
@ApiBadRequestResponseCustom()
@ApiInternalServerErrorResponseCustom()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Public()
  @ApiResponseCustom(RoleWithPermissionsDto, {
    isArray: true,
  })
  async getRoles(): Promise<RoleWithPermissionsDto[]> {
    return this.roleService.getRoles();
  }
}
