import { plainToInstance } from 'class-transformer';
import { ClsService } from 'nestjs-cls';
import { Injectable, Logger } from '@nestjs/common';
import {
  ListUserDto,
  ListUserQueryParamsDto,
} from 'src/modules/users/dtos/list-user.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { EncryptionService } from 'src/shared/services/encryption.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly clsService: ClsService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async listUsers(query: ListUserQueryParamsDto): Promise<ListUserDto> {
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
