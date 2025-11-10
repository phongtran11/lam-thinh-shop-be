import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../modules/auth/dto/jwt-payload.dto';
import { TokenDto } from '../../modules/auth/dto/token.dto';
import { ConfigService } from '@nestjs/config';
import { TConfigs } from 'src/configs/configs.type';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<TConfigs>,
  ) {}

  async generateTokens(jwtPayload: JwtPayload): Promise<TokenDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(jwtPayload),
      this.generateRefreshToken(jwtPayload),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getAccessTokenExpirationDate(),
    };
  }

  generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('jwtAccessToken.secret', {
        infer: true,
      }),
      expiresIn: this.configService.getOrThrow('jwtAccessToken.expiredIn', {
        infer: true,
      }),
    });
  }

  generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('jwtRefreshToken.secret', {
        infer: true,
      }),
      expiresIn: this.configService.getOrThrow('jwtRefreshToken.expiredIn', {
        infer: true,
      }),
    });
  }

  getRefreshTokenExpirationDate(): Date {
    const expiresIn = this.configService.getOrThrow(
      'jwtRefreshToken.expiredIn',
      {
        infer: true,
      },
    );

    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
    return expirationDate;
  }

  getAccessTokenExpirationDate(): Date {
    const expiresIn = this.configService.getOrThrow(
      'jwtAccessToken.expiredIn',
      {
        infer: true,
      },
    );

    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
    return expirationDate;
  }
}
