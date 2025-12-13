import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}
}
