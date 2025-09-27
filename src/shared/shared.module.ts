import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionService } from './services/encryption.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [EncryptionService, TokenService],
  exports: [EncryptionService, TokenService],
})
export class SharedModule {}
