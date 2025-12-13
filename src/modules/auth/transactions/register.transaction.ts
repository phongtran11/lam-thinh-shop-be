import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Role } from 'src/modules/roles/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { hashString } from 'src/shared/helpers/hash.helper';
import { JwtPayload } from 'src/shared/modules/jwt-tokens/jwt-tokens.dto';
import { JwtTokensService } from 'src/shared/modules/jwt-tokens/jwt-tokens.service';
import { BaseTransaction } from 'src/shared/providers/transaction.provider';
import { TokenDto } from '../dtos/token.dto';
import { RefreshTokensRepository } from '../repositories/refresh-token.repository';

@Injectable()
export class RegisterTransaction extends BaseTransaction {
  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
    protected readonly tokenService: JwtTokensService,
    protected readonly userRepo: UsersRepository,
    protected readonly refreshTokensRepo: RefreshTokensRepository,
  ) {
    super(dataSource);
  }

  /**
   * Register transaction
   * - Insert new user
   * - Generate tokens
   * - Hash refresh token
   * - Insert new refresh token
   * - Return tokens
   * - Throws BadRequestException if insert user or refresh token fails
   */
  async execute(
    newUser: User,
    customerRole: Role,
  ): Promise<{
    tokens: TokenDto;
    user: User;
  }> {
    return this.transaction(async (entityManager) => {
      const userRepo = entityManager.withRepository(this.userRepo);
      const insertUserResult = await userRepo.insert(newUser);
      if (insertUserResult.identifiers.length === 0) {
        throw new BadRequestException('Failed to create new user');
      }

      const jwtPayload: JwtPayload = {
        sub: newUser.id,
        email: newUser.email,
        roleName: customerRole.name,
        jti: uuidv4(),
      };
      const tokens = await this.tokenService.generateTokens(jwtPayload);
      const refreshTokenHash = await hashString(tokens.refreshToken);

      const refreshTokenRepo = entityManager.withRepository(
        this.refreshTokensRepo,
      );
      const insertRefreshTokenResult = await refreshTokenRepo.insert({
        id: jwtPayload.jti,
        userId: newUser.id,
        tokenHash: refreshTokenHash,
        expiresAt: tokens.refreshTokenExpiresDate,
      });
      if (insertRefreshTokenResult.identifiers.length === 0) {
        throw new BadRequestException('Failed to create refresh token');
      }

      return {
        tokens,
        user: newUser,
      };
    });
  }
}
