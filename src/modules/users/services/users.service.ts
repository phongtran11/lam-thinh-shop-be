import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { ClsService } from 'nestjs-cls';
import { EncryptionService } from 'src/shared/services/encryption.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly clsService: ClsService,
    private readonly encryptionService: EncryptionService,
  ) {}
}
