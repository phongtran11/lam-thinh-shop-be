import { DataSource, EntityManager } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { TokenDto } from 'src/modules/auth/dto/token.dto';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { Role } from 'src/modules/roles-permissions/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';
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
    customerRole: Role,
  ): Promise<{
    tokens: TokenDto;
    user: User;
  }> {
    return this.transaction(async (entityManager) => {
      await entityManager.getRepository(User).insert(newUser);

      const jwtPayload: JwtPayload = {
        sub: newUser.id,
        email: newUser.email,
        roleName: customerRole.name,
        jti: uuidv4(),
      };

      const tokens = await this.tokenService.generateTokens(jwtPayload);

      await this.insertRefreshToken(
        entityManager,
        tokens,
        newUser.id,
        jwtPayload,
      );

      return {
        tokens,
        user: newUser,
      };
    });
  }

  async insertRefreshToken(
    entityManager: EntityManager,
    tokens: TokenDto,
    userId: string,
    jwtPayload: JwtPayload,
  ): Promise<void> {
    const refreshTokensRepository = entityManager.getRepository(RefreshToken);

    const refreshTokenHash = await this.encryptionService.hash(
      tokens.refreshToken,
    );

    await refreshTokensRepository.insert({
      id: jwtPayload.jti,
      userId,
      tokenHash: refreshTokenHash,
      expiresAt: tokens.refreshTokenExpiresIn,
    });
  }
}
