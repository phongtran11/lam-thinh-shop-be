import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  getSchemaPath,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  InternalServerErrorResponseDto,
  NotFoundResponseDto,
  SuccessResponseDto,
  UnauthorizedResponseDto,
} from 'src/shared/dtos';

export const ApiResponseOkCustom = <T extends Type<any>>(
  data: T,
  options: { isArray?: boolean } = {},
) => {
  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, data),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          options.isArray
            ? {
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      items: {
                        type: 'array',
                        items: { $ref: getSchemaPath(data) },
                      },
                      page: { type: 'number', example: 1 },
                      limit: { type: 'number', example: 10 },
                      totalItem: { type: 'number', example: 100 },
                      totalPage: { type: 'number', example: 10 },
                    },
                  },
                },
              }
            : {
                properties: {
                  data: {
                    $ref: getSchemaPath(data),
                  },
                },
              },
        ],
      },
    }),
  );
};

export const ApiCreatedResponseCustom = <T extends Type<any>>(data: T) => {
  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, data),
    ApiCreatedResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(data),
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiBadRequestResponseCustom = () => {
  return applyDecorators(
    ApiExtraModels(BadRequestResponseDto),
    ApiBadRequestResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(BadRequestResponseDto) }],
      },
    }),
  );
};

export const ApiUnauthorizedResponseCustom = () => {
  return applyDecorators(
    ApiExtraModels(UnauthorizedResponseDto),
    ApiUnauthorizedResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(UnauthorizedResponseDto) }],
      },
    }),
  );
};

export const ApiNotFoundResponseCustom = () => {
  return applyDecorators(
    ApiExtraModels(NotFoundResponseDto),
    ApiNotFoundResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(NotFoundResponseDto) }],
      },
    }),
  );
};

export const ApiInternalServerErrorResponseCustom = () => {
  return applyDecorators(
    ApiExtraModels(InternalServerErrorResponseDto),
    ApiInternalServerErrorResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(InternalServerErrorResponseDto) }],
      },
    }),
  );
};
