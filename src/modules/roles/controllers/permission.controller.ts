import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionResponseDto } from '../dto/permission-response.dto';
import { ApiResponseCustom } from 'src/shared/decorators/swagger.decorator';
import { PermissionService } from '../services/permission.service';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('owned')
  @ApiResponseCustom(PermissionResponseDto, {
    isArray: true,
  })
  async findOwnedPermissions(): Promise<PermissionResponseDto[]> {
    return this.permissionService.findOwnedPermissions();
  }
}
