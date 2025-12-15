import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserCustomersService } from '../services/user-customers.service';

@Controller('user-customers')
@ApiTags('User Customers')
export class UserCustomersController {
  constructor(private readonly userCustomersService: UserCustomersService) {}
}
