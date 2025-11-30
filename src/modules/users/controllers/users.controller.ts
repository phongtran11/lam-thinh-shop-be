import { Controller } from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UsersService } from 'src/modules/users/services';
import { ApiBadRequestResponseCustom } from 'src/shared/decorators';

@ApiTags('Users')
@Controller('users')
@ApiBadRequestResponseCustom()
@ApiUnauthorizedResponse()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
