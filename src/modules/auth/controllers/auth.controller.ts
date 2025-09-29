import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../../../shared/guards/local-auth.guard';
import { TokenDto } from '../dto/token.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiCreatedResponseCustom,
  ApiUnauthorizedResponseCustom,
} from 'src/shared/decorators/swagger.decorator';
import { RefreshTokenRequestDto } from '../dto/refresh-token.dto';
import { LogoutDto } from '../dto/logout.dto';
import { JwtPayload } from '../dto/jwt-payload.dto';

@Controller('auth')
@ApiTags('Auth')
@Public()
@ApiBadRequestResponseCustom()
@ApiUnauthorizedResponseCustom()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiCreatedResponseCustom(TokenDto)
  @ApiBody({ type: LoginDto })
  async login(
    @Req()
    { user, ip, headers }: { user: JwtPayload; ip: string; headers: Headers },
  ): Promise<TokenDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.login(user, ip, headers['user-agent']);
  }

  @Post('register')
  @ApiCreatedResponseCustom(TokenDto)
  async register(
    @Body() registerDto: RegisterDto,
    @Req() { ip, headers }: { ip: string; headers: Headers },
  ): Promise<TokenDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.register(registerDto, ip, headers['user-agent']);
  }

  @Post('refresh-token')
  @ApiCreatedResponseCustom(TokenDto)
  async refreshToken(
    @Body() refreshTokenRequestDto: RefreshTokenRequestDto,
  ): Promise<TokenDto> {
    return this.authService.refreshToken(refreshTokenRequestDto);
  }

  @Post('logout')
  @ApiCreatedResponse({
    description: 'Successfully logged out',
  })
  async logout(@Body() logoutDto: LogoutDto): Promise<void> {
    return this.authService.logout(logoutDto);
  }
}
