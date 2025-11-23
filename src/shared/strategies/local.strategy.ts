import { Strategy } from 'passport-local';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { HTTPUnauthorizedException } from 'src/shared/exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<JwtPayload> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new HTTPUnauthorizedException('Email or password are not corected');
    }

    return {
      sub: user.id,
      email: user.email,
      roleName: user.role.name,
      jti: uuidv4(),
    };
  }
}
