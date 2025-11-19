import { plainToInstance } from 'class-transformer';
import { Injectable, Logger } from '@nestjs/common';
import {
  ListUserDto,
  ListUserQueryParamsDto,
} from 'src/modules/users/dtos/list-user.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async listCustomer(query: ListUserQueryParamsDto) {
    const [users, totalUsers] =
      await this.usersRepository.findCustomersByCondition(
        query.skip,
        query.limit,
        query.keywords,
      );

    return plainToInstance(ListUserDto, {
      items: users,
      totalItem: totalUsers,
      limit: query.limit,
      page: query.page,
    });
  }
}
