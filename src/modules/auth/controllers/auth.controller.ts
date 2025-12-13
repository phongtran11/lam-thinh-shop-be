import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiCreatedResponseCustom,
  ApiResponseOkCustom,
  ApiUnauthorizedResponseCustom,
} from 'src/shared/decorators/swagger.decorator';
import { AuthResDto } from '../dtos/auth.dto';
import { LoginDto } from '../dtos/login.dto';
import { LogoutDto } from '../dtos/logout.dto';
import { RefreshTokenRequestDto } from '../dtos/refresh-token.dto';
import { RegisterDto } from '../dtos/register.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
@ApiTags('Auth')
@ApiBadRequestResponseCustom()
@ApiUnauthorizedResponseCustom()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponseOkCustom(AuthResDto)
  async login(@Body() loginDto: LoginDto): Promise<AuthResDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponseCustom(AuthResDto)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResDto> {
    return this.authService.register(registerDto);
  }

  @Post('refresh-token')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponseOkCustom(AuthResDto)
  async refreshToken(
    @Body() refreshTokenRequestDto: RefreshTokenRequestDto,
  ): Promise<AuthResDto> {
    return this.authService.refreshToken(refreshTokenRequestDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async logout(@Body() logoutDto: LogoutDto): Promise<void> {
    return this.authService.logout(logoutDto);
  }
}
