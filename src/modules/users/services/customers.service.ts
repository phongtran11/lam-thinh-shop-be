import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { ListUserDto, ListUserQueryParamsDto } from '../dto/list-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async listCustomer(query: ListUserQueryParamsDto) {
    const [users, totalUsers] =
      await this.usersRepository.findCustomersByCondition(
        query.skip,
        query.limit,
        query.search,
      );

    return plainToInstance(ListUserDto, {
      items: users,
      totalItem: totalUsers,
      limit: query.limit,
      page: query.page,
    });
  }
}
