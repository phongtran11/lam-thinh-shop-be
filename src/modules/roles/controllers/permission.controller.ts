import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionService } from '../services/permission.service';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiInternalServerErrorResponseCustom,
  ApiResponseCustom,
} from 'src/shared/decorators/swagger.decorator';
import { PermissionDto } from '../dto/permission.dto';

@ApiTags('Permissions')
@Controller('permissions')
@ApiBadRequestResponseCustom()
@ApiInternalServerErrorResponseCustom()
export class PermissionsController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @Public()
  @ApiResponseCustom(PermissionDto, {
    isArray: true,
  })
  async getPermissions(): Promise<PermissionDto[]> {
    return this.permissionService.getPermissions();
  }
}
