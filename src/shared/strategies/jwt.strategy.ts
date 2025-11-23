import { ClsService } from 'nestjs-cls';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { TConfigs } from 'src/configs/configs.type';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { CLS_KEY } from 'src/shared/constants/cls.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService<TConfigs>,
    private readonly clsService: ClsService,
    private readonly usersRepository: UsersRepository,
    // private readonly pinoLogger: PinoLogger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('jwtAccessTokenConfig.secret', {
        infer: true,
      }),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersRepository.findOneWithRolePermissionsById(
      payload.sub,
    );

    this.clsService.set<JwtPayload>(CLS_KEY.JWT_PAYLOAD, payload);

    // this.pinoLogger.assign(payload);

    return user;
  }
}
