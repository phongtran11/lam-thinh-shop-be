import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto/user.response.dto';
import { ClsService } from 'nestjs-cls';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { EncryptionService } from 'src/shared/services/encryption.service';
import { RoleEnum } from 'src/shared/enums/roles.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly clsService: ClsService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async getProfile(): Promise<UserDto> {
    const userId = this.clsService.get<JwtPayload>('user').sub;

    const user = await this.usersRepository.findOneByUserId(userId);

    return plainToInstance(UserDto, user);
  }

  async seedAdminUser() {
    const adminUser = this.usersRepository.create();
    adminUser.email = 'admin@example.com';
    adminUser.password = await this.encryptionService.hash('password123');
    adminUser.firstName = 'Admin';
    adminUser.lastName = 'User';
    adminUser.roleName = RoleEnum.SUPER_ADMIN;

    await this.usersRepository.upsert(adminUser, ['email']);
  }
}
