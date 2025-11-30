import { hash, verify } from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionService {
  hash(raw: string): Promise<string> {
    return hash(raw, { timeCost: 2, memoryCost: 15360, parallelism: 1 });
  }

  compare(hash: string, raw: string): Promise<boolean> {
    return verify(hash, raw);
  }
}
