import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokensService } from './jwt-tokens.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtTokensService],
  exports: [JwtModule, JwtTokensService],
})
export class JwtTokensModule {}
