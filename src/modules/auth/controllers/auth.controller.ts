import { Controller, Post, UseGuards, Body, Req, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../../../shared/guards/local-auth.guard';
import { TokenDto } from '../dto/token.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiCreatedResponseCustom,
  ApiResponseCustom,
  ApiUnauthorizedResponseCustom,
} from 'src/shared/decorators/swagger.decorator';
import { RefreshTokenRequestDto } from '../dto/refresh-token.dto';
import { LogoutDto } from '../dto/logout.dto';
import { JwtPayload } from '../dto/jwt-payload.dto';
import { GetMeResponseDto } from '../dto/me.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBadRequestResponseCustom()
@ApiUnauthorizedResponseCustom()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiCreatedResponseCustom(TokenDto)
  @ApiBody({ type: LoginDto })
  async login(
    @Req()
    { user }: { user: JwtPayload },
  ): Promise<TokenDto> {
    return this.authService.login(user);
  }

  @Post('register')
  @Public()
  @ApiCreatedResponseCustom(TokenDto)
  async register(@Body() registerDto: RegisterDto): Promise<TokenDto> {
    return this.authService.register(registerDto);
  }

  @Post('refresh-token')
  @Public()
  @ApiCreatedResponseCustom(TokenDto)
  async refreshToken(
    @Body() refreshTokenRequestDto: RefreshTokenRequestDto,
  ): Promise<TokenDto> {
    return this.authService.refreshToken(refreshTokenRequestDto);
  }

  @Post('logout')
  @ApiOkResponse()
  async logout(@Body() logoutDto: LogoutDto): Promise<void> {
    return this.authService.logout(logoutDto);
  }

  @Get('me')
  @ApiResponseCustom(GetMeResponseDto)
  async getMe(): Promise<GetMeResponseDto> {
    return await this.authService.getMe();
  }
}
