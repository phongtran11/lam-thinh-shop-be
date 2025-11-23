import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { TokenDto } from 'src/modules/auth/dto/token.dto';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { Role } from 'src/modules/roles-permissions/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { HTTPInternalServerErrorException } from 'src/shared/exceptions';
import { BaseTransaction } from 'src/shared/providers/transaction.provider';
import { EncryptionService } from 'src/shared/services/encryption.service';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class RegisterTransaction extends BaseTransaction {
  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
    protected readonly tokenService: TokenService,
    protected readonly encryptionService: EncryptionService,
  ) {
    super(dataSource);
  }

  /**
   * Register transaction
   * - Insert new user
   * - Query role by roleId
   * - If role not found, throw InternalServerErrorException
   * - Set role to newUser
   * - Generate tokens
   * - Insert new refresh token
   * - Return tokens
   */
  async execute(
    newUser: User,
    refreshToken: RefreshToken,
  ): Promise<{
    token: TokenDto;
    user: User;
  }> {
    return this.transaction(async (entityManager) => {
      const usersRepository = entityManager.getRepository(User);
      const refreshTokensRepository = entityManager.getRepository(RefreshToken);
      const roleRepository = entityManager.getRepository(Role);

      await usersRepository.insert(newUser);

      const role = await roleRepository
        .createQueryBuilder('role')
        .where('role.id = :id', { id: newUser.roleId })
        .getOne();

      if (!role) {
        throw new HTTPInternalServerErrorException('Role not found');
      }

      const jwtPayload: JwtPayload = {
        sub: newUser.id,
        email: newUser.email,
        roleName: role.name,
        jti: uuidv4(),
      };

      const tokens = await this.tokenService.generateTokens(jwtPayload);
      const refreshTokenHash = await this.encryptionService.hash(
        tokens.refreshToken,
      );

      refreshToken.id = jwtPayload.jti;
      refreshToken.userId = newUser.id;
      refreshToken.tokenHash = refreshTokenHash;
      refreshToken.expiresAt = tokens.refreshTokenExpiresIn;

      await refreshTokensRepository.insert(refreshToken);

      const userInserted = await usersRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: newUser.id })
        .leftJoin('user.role', 'role')
        .leftJoin('role.rolePermissions', 'rolePermissions')
        .leftJoin('rolePermissions.permission', 'permission')
        .select(['user', 'role', 'permission'])
        .getOne();

      if (!userInserted) {
        throw new HTTPInternalServerErrorException('User not inserted');
      }

      return {
        token: tokens,
        user: userInserted,
      };
    });
  }
}
