import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionService } from 'src/shared/services/encryption.service';
import { TokenService } from 'src/shared/services/token.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [EncryptionService, TokenService],
  exports: [EncryptionService, TokenService],
})
export class SharedModule {}
