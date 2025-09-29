import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuditUserInfoDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'John',
  })
  @Expose()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
  })
  @Expose()
  lastName?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
  })
  @Expose()
  email?: string;
}
