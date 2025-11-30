import { ClsService } from 'nestjs-cls';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { Configurations } from 'src/shared/configs';
import { CLS_KEY } from 'src/shared/constants/cls.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService<Configurations>,
    private readonly clsService: ClsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('jwt.accessToken.secret', {
        infer: true,
      }),
    });
  }

  validate(payload: JwtPayload) {
    this.clsService.set<JwtPayload>(CLS_KEY.JWT_PAYLOAD, payload);
    return payload;
  }
}
