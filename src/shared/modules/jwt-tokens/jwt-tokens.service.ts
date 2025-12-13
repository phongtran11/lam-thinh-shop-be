import { plainToInstance } from 'class-transformer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Configurations } from '../../configs';
import { JwtPayload, TokenDto } from './jwt-tokens.dto';

@Injectable()
export class JwtTokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Configurations>,
  ) {}

  async generateTokens(jwtPayload: JwtPayload): Promise<TokenDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(jwtPayload),
      this.generateRefreshToken(jwtPayload),
    ]);

    return plainToInstance(TokenDto, {
      accessToken,
      refreshToken,
      accessTokenExpiresDate: this.getAccessTokenExpirationDate(),
      refreshTokenExpiresDate: this.getRefreshTokenExpirationDate(),
    });
  }

  generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('jwt.accessToken.secret', {
        infer: true,
      }),
      expiresIn: this.configService.getOrThrow('jwt.accessToken.expiration', {
        infer: true,
      }),
    });
  }

  generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('jwt.refreshToken.secret', {
        infer: true,
      }),
      expiresIn: this.configService.getOrThrow('jwt.refreshToken.expiration', {
        infer: true,
      }),
    });
  }

  verifyRefreshToken(refreshToken: string): JwtPayload {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow('jwt.refreshToken.secret', {
          infer: true,
        }),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  getAccessTokenExpirationDate(): Date {
    const expiresIn = this.configService.getOrThrow(
      'jwt.accessToken.expiration',
      {
        infer: true,
      },
    );

    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
    return expirationDate;
  }

  getRefreshTokenExpirationDate(): Date {
    const expiresIn = this.configService.getOrThrow(
      'jwt.refreshToken.expiration',
      {
        infer: true,
      },
    );

    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
    return expirationDate;
  }
}
