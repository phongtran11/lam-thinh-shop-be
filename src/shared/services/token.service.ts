import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TConfigs } from 'src/configs/configs.type';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { TokenDto } from 'src/modules/auth/dto/token.dto';

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

    return plainToInstance(TokenDto, {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: this.getAccessTokenExpirationDate(),
      refreshTokenExpiresIn: this.getRefreshTokenExpirationDate(),
    });
  }

  generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('jwtAccessTokenConfig.secret', {
        infer: true,
      }),
      expiresIn: this.configService.getOrThrow(
        'jwtAccessTokenConfig.expiredIn',
        {
          infer: true,
        },
      ),
    });
  }

  generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('jwtRefreshTokenConfig.secret', {
        infer: true,
      }),
      expiresIn: this.configService.getOrThrow(
        'jwtRefreshTokenConfig.expiredIn',
        {
          infer: true,
        },
      ),
    });
  }

  getRefreshTokenExpirationDate(): Date {
    const expiresIn = this.configService.getOrThrow(
      'jwtRefreshTokenConfig.expiredIn',
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
      'jwtAccessTokenConfig.expiredIn',
      {
        infer: true,
      },
    );

    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
    return expirationDate;
  }
}
