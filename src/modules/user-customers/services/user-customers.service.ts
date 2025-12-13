import { Injectable } from '@nestjs/common';
import { UserCustomersRepository } from '../repositories/user-customers.repository';

@Injectable()
export class UserCustomersService {
  constructor(
    private readonly userCustomersRepository: UserCustomersRepository,
  ) {}
}
