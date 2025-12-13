import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  refreshToken: string;

  @ApiProperty({
    example: new Date(Date.now() + 3600 * 1000),
  })
  @Expose()
  accessTokenExpiresDate: Date;

  @ApiProperty({
    example: new Date(Date.now() + 86400 * 1000),
  })
  @Expose()
  refreshTokenExpiresDate: Date;
}
