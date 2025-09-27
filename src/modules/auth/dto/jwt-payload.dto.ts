import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class JwtPayload {
  @Expose()
  sub: string;

  @Expose()
  email: string;
}
