import { Controller, Post, UseGuards, Body, Req, Get } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { LogoutDto } from 'src/modules/auth/dto/logout.dto';
import { GetMeResponseDto } from 'src/modules/auth/dto/me.dto';
import { RefreshTokenRequestDto } from 'src/modules/auth/dto/refresh-token.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { TokenDto } from 'src/modules/auth/dto/token.dto';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiCreatedResponseCustom,
  ApiResponseCustom,
  ApiUnauthorizedResponseCustom,
} from 'src/shared/decorators/swagger.decorator';
import { LocalAuthGuard } from 'src/shared/guards/local-auth.guard';

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
