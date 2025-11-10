import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {
  ApiBadRequestResponseCustom,
  ApiResponseCustom,
} from 'src/shared/decorators/swagger.decorator';
import { ListUserDto, ListUserQueryParamsDto } from '../dto/list-user.dto';

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
