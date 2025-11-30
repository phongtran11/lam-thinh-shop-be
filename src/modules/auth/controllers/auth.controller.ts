import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { LogoutDto } from 'src/modules/auth/dto/logout.dto';
import { RefreshTokenRequestDto } from 'src/modules/auth/dto/refresh-token.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiCreatedResponseCustom,
  ApiResponseOkCustom,
  ApiUnauthorizedResponseCustom,
} from 'src/shared/decorators/swagger.decorator';
import { AuthResDto } from '../dto/auth.dto';

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
