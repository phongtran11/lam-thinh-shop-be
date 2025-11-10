import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { ClsService } from 'nestjs-cls';
import { EncryptionService } from 'src/shared/services/encryption.service';
import { ListUserDto, ListUserQueryParamsDto } from '../dto/list-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly clsService: ClsService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async listUsers(query: ListUserQueryParamsDto) {
    const [users, totalUsers] = await this.usersRepository.findUsersByCondition(
      query.skip,
      query.limit,
    );

    return plainToInstance(ListUserDto, {
      items: users,
      totalItem: totalUsers,
      limit: query.limit,
      page: query.page,
    });
  }
}
