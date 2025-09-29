import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../dto/user.response.dto';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {
  ApiBadRequestResponseCustom,
  ApiResponseCustom,
} from 'src/shared/decorators/swagger.decorator';

@ApiTags('Users')
@Controller('users')
@ApiBadRequestResponseCustom()
@ApiUnauthorizedResponse()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiResponseCustom(UserDto)
  async getProfile(): Promise<UserDto> {
    return this.usersService.getProfile();
  }
}
