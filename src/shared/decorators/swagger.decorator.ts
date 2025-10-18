import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  getSchemaPath,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  CreatedResponseDto,
  NotFoundResponseDto,
  SuccessResponseDto,
  UnauthorizedResponseDto,
} from '../dto/response.dto';

export const ApiResponseCustom = <T extends Type<any>>(
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
                    type: 'array',
                    items: { $ref: getSchemaPath(data) },
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
    ApiExtraModels(CreatedResponseDto, data),
    ApiCreatedResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(CreatedResponseDto) },
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
    ApiExtraModels(NotFoundResponseDto),
    ApiNotFoundResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(NotFoundResponseDto) }],
      },
    }),
  );
};
