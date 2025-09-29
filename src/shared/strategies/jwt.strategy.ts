import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configs } from 'src/configs/configs.type';
import { ClsService } from 'nestjs-cls';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService<Configs>,
    private readonly clsService: ClsService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('jwt.secret', { infer: true }),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersRepository.findOneWithRolePermissionsById(
      payload.sub,
    );

    this.clsService.set<JwtPayload>('user', payload);

    return user;
  }
}
