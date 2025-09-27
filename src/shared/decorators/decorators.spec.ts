import { validate } from 'class-validator';
import { IsVNPhoneNumber } from './isVNPhoneNumber.decorator';
import { Match } from './match.decorator';
import { Trim } from './trim.decorator';
import { plainToInstance } from 'class-transformer';
import { IS_PUBLIC_KEY, Public } from './public.decorator';
import { Get } from '@nestjs/common';
import {
  ApiBadRequestResponseCustom,
  ApiResponseCustom,
} from './swagger.decorator';
import { BadRequestResponseDto } from '../dto/response.dto';

describe('Decorators', () => {
  class DummyDto {}

  describe('Trim', () => {
    class TestClass {
      @Trim()
      name: string;
    }

    it('should trim whitespace from the beginning and end of a string', () => {
      const instance = plainToInstance(TestClass, { name: '  test  ' });
      expect(instance.name).toBe('test');
    });
  });

  describe('Match', () => {
    class TestClass {
      password?: string;

      @Match('password')
      passwordConfirmation?: string;
    }

    it('should not return an error if passwords match', async () => {
      const instance = plainToInstance(TestClass, {
        password: 'password',
        passwordConfirmation: 'password',
      });
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should return an error if passwords do not match', async () => {
      const instance = plainToInstance(TestClass, {
        password: 'password',
        passwordConfirmation: 'wrong',
      });
      const errors = await validate(instance);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('Match');
    });
  });

  describe('IsVNPhoneNumber', () => {
    class TestClass {
      @IsVNPhoneNumber()
      phone: string;
    }

    it('should not return an error for valid Vietnamese phone numbers', async () => {
      const validNumbers = [
        '0901234567',
        '+84901234567',
        '0321112222',
        '+84321112222',
      ];
      for (const phone of validNumbers) {
        const instance = new TestClass();
        instance.phone = phone;
        const errors = await validate(instance);
        expect(errors.length).toBe(0);
      }
    });

    it('should return an error for invalid Vietnamese phone numbers', async () => {
      const invalidNumbers = [
        '123456789',
        '090123456',
        '+8490123456',
        '0123456789',
        '090-123-4567',
        '090 123 4567',
      ];
      for (const phone of invalidNumbers) {
        const instance = new TestClass();
        instance.phone = phone;
        const errors = await validate(instance);
        expect(errors.length).toBe(1);
        expect(errors[0].constraints).toHaveProperty('isVNPhoneNumber');
      }
    });

    it('should return an error for non-string values', async () => {
      const instance = new TestClass();
      (instance.phone as any) = 123456789;
      const errors = await validate(instance);
      expect(errors.length).toBe(1);
    });

    it('should set the IS_PUBLIC_KEY metadata to true', () => {
      class TestController {
        @Public()
        @Get()
        getPublicResource() {}
      }
      const controller = new TestController();
      const isPublic = Reflect.getMetadata(
        IS_PUBLIC_KEY,
        controller.getPublicResource,
      );
      expect(isPublic).toBe(true);
    });
  });

  it('should apply ApiResponseCustom', () => {
    class TestController {
      @ApiResponseCustom(DummyDto)
      getResource() {}
    }
    const controller = new TestController();
    const responses = Reflect.getMetadata(
      'swagger/apiResponse',
      controller.getResource,
    );

    //  Check response ref correct schema
    expect(responses['200'].schema.allOf[0]['$ref']).toEqual(
      '#/components/schemas/SuccessResponseDto',
    );
  });

  it('should apply ApiBadRequestResponseCustom and ApiBearerAuth decorators', () => {
    class TestController {
      @ApiBadRequestResponseCustom()
      getResource() {}
    }
    const controller = new TestController();
    const responses = Reflect.getMetadata(
      'swagger/apiResponse',
      controller.getResource,
    );

    expect(responses).toHaveProperty('400');
    expect(responses['400'].type).toBe(BadRequestResponseDto);
  });
  it('should apply ApiResponseCustom with correct schema', () => {
    class TestController {
      @ApiResponseCustom(DummyDto)
      getResource() {}
    }
    const controller = new TestController();
    const responses = Reflect.getMetadata(
      'swagger/apiResponse',
      controller.getResource,
    );
    expect(responses['200'].schema.allOf[0]['$ref']).toEqual(
      '#/components/schemas/SuccessResponseDto',
    );
    expect(responses['200'].schema.allOf[1].properties.data['$ref']).toEqual(
      '#/components/schemas/DummyDto',
    );
  });
  it('should apply ApiCreatedResponseCustom with correct schema', () => {
    class TestController {
      @ApiCreatedResponseCustom(DummyDto)
      createResource() {}
    }
    const controller = new TestController();
    const responses = Reflect.getMetadata(
      'swagger/apiResponse',
      controller.createResource,
    );
    expect(responses['201'].schema.allOf[0]['$ref']).toEqual(
      '#/components/schemas/CreatedResponseDto',
    );
    expect(responses['201'].schema.allOf[1].properties.data['$ref']).toEqual(
      '#/components/schemas/DummyDto',
    );
  });
  it('should apply ApiBadRequestResponseCustom with correct schema', () => {
    class TestController {
      @ApiBadRequestResponseCustom()
      getResource() {}
    }
    const controller = new TestController();
    const responses = Reflect.getMetadata(
      'swagger/apiResponse',
      controller.getResource,
    );
    expect(responses['400'].schema.allOf[0]['$ref']).toEqual(
      '#/components/schemas/BadRequestResponseDto',
    );
  });
  it('should apply ApiUnauthorizedResponseCustom with correct schema', () => {
    class TestController {
      @ApiUnauthorizedResponseCutom()
      getResource() {}
    }
    const controller = new TestController();
    const responses = Reflect.getMetadata(
      'swagger/apiResponse',
      controller.getResource,
    );
    expect(responses['401'].schema.allOf[0]['$ref']).toEqual(
      '#/components/schemas/UnauthorizedResponseDto',
    );
  });
  it('should apply ApiNotFoundResponseCustom with correct schema', () => {
    class TestController {
      @ApiNotFoundResponseCustom()
      getResource() {}
    }
    const controller = new TestController();
    const responses = Reflect.getMetadata(
      'swagger/apiResponse',
      controller.getResource,
    );
    expect(responses['404'].schema.allOf[0]['$ref']).toEqual(
      '#/components/schemas/NotFoundResponseDto',
    );
  });
});
