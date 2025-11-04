import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configs } from 'src/configs/configs.type';
import { ClsService } from 'nestjs-cls';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { PinoLogger } from 'pino-nestjs';
import { CLS_KEY } from '../constants/cls.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService<Configs>,
    private readonly clsService: ClsService,
    private readonly usersRepository: UsersRepository,
    private readonly pinoLogger: PinoLogger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('jwtAccessToken.secret', {
        infer: true,
      }),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersRepository.findOneWithRolePermissionsById(
      payload.sub,
    );

    this.clsService.set<JwtPayload>(CLS_KEY.JWT_PAYLOAD, payload);

    this.pinoLogger.assign(payload);

    return user;
  }
}
