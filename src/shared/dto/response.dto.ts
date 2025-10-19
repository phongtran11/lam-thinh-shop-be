import { ApiProperty } from '@nestjs/swagger';
import { AuditUserInfoDto } from './audit-user-info.dto';
import { Exclude, Expose, Type } from 'class-transformer';

export class SuccessResponseDto<T> {
  @ApiProperty({
    example: 200,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    example: 'success',
    type: String,
  })
  message: string;

  data: T;
}

export class CreatedResponseDto<T> {
  @ApiProperty({
    example: 201,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    example: 'success',
    type: String,
  })
  message: string;

  data: T;
}

export class BadRequestResponseDto {
  @ApiProperty({
    example: ['property is required'],
    isArray: true,
    type: String,
  })
  message: string[];

  @ApiProperty({
    example: 'Bad request',
    type: String,
  })
  error: string;

  @ApiProperty({
    example: 400,
    type: Number,
  })
  statusCode: number;
}

export class UnauthorizedResponseDto {
  @ApiProperty({
    example: 'Unauthorized',
    type: String,
  })
  message: string;

  @ApiProperty({
    example: 401,
    type: Number,
  })
  statusCode: number;
}

export class NotFoundResponseDto {
  @ApiProperty({
    example: ['resouce is not found!'],
    isArray: true,
    type: String,
  })
  message: string[];

  @ApiProperty({
    example: 'Not found',
    type: String,
  })
  error: string;

  @ApiProperty({
    example: 404,
    type: Number,
  })
  statusCode: number;
}

export class InternalServerErrorResponseDto {
  @ApiProperty({
    example: 'Internal server error',
    type: String,
  })
  message: string;

  @ApiProperty({
    example: 500,
    type: Number,
  })
  statusCode: number;
}

@Exclude()
export class BaseResponse {
  @ApiProperty({
    example: '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: new Date(),
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    example: new Date(),
  })
  @Expose()
  deletedAt: Date;

  @ApiProperty({
    type: AuditUserInfoDto,
  })
  @Expose()
  @Type(() => AuditUserInfoDto)
  createdByUser: AuditUserInfoDto;

  @ApiProperty({
    type: AuditUserInfoDto,
  })
  @Expose()
  @Type(() => AuditUserInfoDto)
  updatedByUser: AuditUserInfoDto;

  @ApiProperty({
    type: AuditUserInfoDto,
  })
  @Expose()
  @Type(() => AuditUserInfoDto)
  deletedByUser: AuditUserInfoDto;
}
