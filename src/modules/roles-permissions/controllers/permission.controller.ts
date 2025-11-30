import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionDto } from 'src/modules/roles-permissions/dtos/permission.dto';
import { PermissionService } from 'src/modules/roles-permissions/services/permission.service';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiInternalServerErrorResponseCustom,
  ApiResponseOkCustom,
} from 'src/shared/decorators/swagger.decorator';

@ApiTags('Permissions')
@Controller('permissions')
@ApiBadRequestResponseCustom()
@ApiInternalServerErrorResponseCustom()
export class PermissionsController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @Public()
  @ApiResponseOkCustom(PermissionDto, {
    isArray: true,
  })
  async getPermissions(): Promise<PermissionDto[]> {
    return this.permissionService.getPermissions();
  }
}
