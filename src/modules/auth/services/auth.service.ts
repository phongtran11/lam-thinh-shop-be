import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { TokenDto } from '../dto/token.dto';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { TokenService } from '../../../shared/services/token.service';
import { plainToInstance } from 'class-transformer';
import { JwtPayload } from '../dto/jwt-payload.dto';
import { UserDto } from '../../users/dto/user.response.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly encryptionService: EncryptionService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) return plainToInstance(UserDto, null);

    const isCorrectPassword = await this.encryptionService.compare(
      password,
      user.password,
    );

    if (user && isCorrectPassword) {
      return plainToInstance(UserDto, user);
    }
    return plainToInstance(UserDto, null);
  }

  async login(loginDto: LoginDto): Promise<TokenDto> {
    const jwtPayload: JwtPayload = {
      sub: loginDto.user.id,
      email: loginDto.user.email,
    };

    const tokens = await this.tokenService.generateTokens(jwtPayload);

    return plainToInstance(TokenDto, tokens);
  }

  async register(registerDto): Promise<TokenDto> {
    return plainToInstance(TokenDto, null);
  }
}
