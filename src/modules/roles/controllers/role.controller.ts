import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiResponseOkCustom,
  ApiUnauthorizedResponseCustom,
  ApiQueryCustom,
} from 'src/shared/decorators/swagger.decorator';
import {
  RoleFilterDto,
  RoleListingDto,
  RoleListingReqDto,
  RoleOrderDto,
} from '../dtos/role-listing.dto';
import { RoleDto, RoleRequestDto, RoleWithPermissionsDto } from '../dtos/role.dto';
import { RoleService } from '../services/role.service';

@ApiTags('Roles')
@Controller('roles')
@ApiBadRequestResponseCustom()
@ApiUnauthorizedResponseCustom()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Public()
  @ApiResponseOkCustom(RoleListingDto)
  @ApiQueryCustom({
    name: 'filter',
    type: RoleFilterDto,
  })
  @ApiQueryCustom({
    name: 'order',
    type: RoleOrderDto,
  })
  async getRoles(@Query() query: RoleListingReqDto): Promise<RoleListingDto> {
    return this.roleService.getRoles(query);
  }

  @Get(':id')
  @ApiResponseOkCustom(RoleDto)
  async getRole(@Param('id') id: string): Promise<RoleDto> {
    return await this.roleService.findOne(id);
  }

  @Post()
  @ApiResponseOkCustom(RoleDto)
  async createRole(@Body() dto: RoleRequestDto): Promise<RoleDto> {
    return await this.roleService.create(dto);
  }

  @Put(':id')
  @ApiResponseOkCustom(RoleDto)
  async updateRole(
    @Param('id') id: string,
    @Body() dto: RoleRequestDto,
  ): Promise<RoleDto> {
    return await this.roleService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async deleteRole(@Param('id') id: string): Promise<void> {
    return this.roleService.delete(id);
  }
}
