import { hash, verify } from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionService {
  hash(raw: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return hash(raw);
  }

  compare(hash: string, raw: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return verify(hash, raw);
  }
}
