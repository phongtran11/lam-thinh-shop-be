import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiInternalServerErrorResponseCustom,
  ApiQueryCustom,
  ApiResponseOkCustom,
} from 'src/shared/decorators/swagger.decorator';
import {
  PermissionFilterDto,
  PermissionListingDto,
  PermissionListingReqDto,
  PermissionOrderDto,
} from '../dtos/permission-listing.dto';
import { PermissionDto } from '../dtos/permission.dto';
import { PermissionService } from '../services/permission.service';

@ApiTags('Permissions')
@Controller('permissions')
@ApiBadRequestResponseCustom()
@ApiInternalServerErrorResponseCustom()
export class PermissionsController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @Public()
  @ApiResponseOkCustom(PermissionListingDto)
  @ApiQueryCustom({
    name: 'filter',
    type: PermissionFilterDto,
  })
  @ApiQueryCustom({
    name: 'order',
    type: PermissionOrderDto,
  })
  async getPermissions(
    @Query() query: PermissionListingReqDto,
  ): Promise<PermissionListingDto> {
    return this.permissionService.getPermissions(query);
  }

  @Get(':id')
  @ApiResponseOkCustom(PermissionDto)
  async getPermission(@Param('id') id: string): Promise<PermissionDto> {
    return await this.permissionService.findOne(id);
  }
}
