import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { TokenDto } from '../dto/token.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiBadRequestResponseCustom,
  ApiCreatedResponseCustom,
  ApiUnauthorizedResponseCutom,
} from 'src/shared/decorators/swagger.decorator';

@Controller('auth')
@ApiTags('Auth')
@ApiBadRequestResponseCustom()
@ApiUnauthorizedResponseCutom()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiCreatedResponseCustom(TokenDto)
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Public()
  @ApiCreatedResponseCustom(TokenDto)
  async register(@Body() registerDto: RegisterDto): Promise<TokenDto> {
    return this.authService.register(registerDto);
  }
}
