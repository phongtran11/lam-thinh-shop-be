
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isVNPhoneNumber', async: false })
export class IsVNPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phone: any) {
    if (typeof phone !== 'string') {
      return false;
    }

    /**
     * examples:
     *  - 0901234567
     *  - +84901234567
     *  - 0321112222
     *  - +84321112222
     * */
    const vietnamesePhoneNumberRegex =
      /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-4|6-9])[0-9]{7}$/;

    return vietnamesePhoneNumberRegex.test(phone);
  }

  defaultMessage(args: ValidationArguments) {
    return '$property must be a valid Vietnamese phone number';
  }
}

/**
 * Decorator that checks if a string is a valid Vietnamese phone number.
 * @param validationOptions The validation options.
 */
export function IsVNPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsVNPhoneNumberConstraint,
    });
  };
}
