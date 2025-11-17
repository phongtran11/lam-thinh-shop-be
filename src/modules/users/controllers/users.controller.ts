import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {
  ApiBadRequestResponseCustom,
  ApiResponseCustom,
} from 'src/shared/decorators/swagger.decorator';
import { ListUserDto, ListUserQueryParamsDto } from '../dtos/list-user.dto';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('users')
@ApiBadRequestResponseCustom()
@ApiUnauthorizedResponse()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponseCustom(ListUserDto)
  listUsers(@Query() query: ListUserQueryParamsDto) {
    return this.usersService.listUsers(query);
  }
}
