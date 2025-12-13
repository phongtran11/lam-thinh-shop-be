import { Controller } from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiBadRequestResponseCustom } from 'src/shared/decorators/swagger.decorator';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('users')
@ApiBadRequestResponseCustom()
@ApiUnauthorizedResponse()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
