import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
