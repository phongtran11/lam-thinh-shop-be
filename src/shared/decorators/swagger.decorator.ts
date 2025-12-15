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
  ApiQuery,
} from '@nestjs/swagger';
import {
  SuccessResponseDto,
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  NotFoundResponseDto,
  InternalServerErrorResponseDto,
} from '../dtos/response.dto';

export const ApiQueryCustom = (options: {
  name: string;
  type: Type<any>;
  required?: boolean;
}) => {
  return applyDecorators(
    ApiQuery({
      name: options.name,
      type: options.type,
      explode: true,
      style: 'deepObject',
      required: options.required ?? false,
    }),
  );
};

export const ApiResponseOkCustom = <T extends Type<any>>(data: T) => {
  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, data),
    ApiOkResponse({
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
