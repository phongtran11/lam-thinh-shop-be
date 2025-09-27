import { ApiProperty } from '@nestjs/swagger';

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
    example: 'created',
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
    example: 'bad request',
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
    example: ['required authorization!'],
    isArray: true,
    type: String,
  })
  message: string[];

  @ApiProperty({
    example: 'unauthorization',
    type: String,
  })
  error: string;

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
    example: 'not found',
    type: String,
  })
  error: string;

  @ApiProperty({
    example: 404,
    type: Number,
  })
  statusCode: number;
}
