import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { TokenDto } from 'src/modules/auth/dto/token.dto';
import { Configurations } from 'src/shared/configs';
import { HTTPUnauthorizedException } from 'src/shared/exceptions';

@Injectable()
export class TokenService {
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
      accessTokenExpiresIn: this.getAccessTokenExpirationDate(),
      refreshTokenExpiresIn: this.getRefreshTokenExpirationDate(),
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
      throw new HTTPUnauthorizedException('Invalid refresh token');
    }
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
}
