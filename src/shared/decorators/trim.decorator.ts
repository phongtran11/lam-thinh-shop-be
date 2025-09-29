import { Transform } from 'class-transformer';
import { isString } from 'class-validator';

export function Trim(): PropertyDecorator {
  return Transform(({ value }) => {
    if (isString(value)) {
      return value.trim();
    }

    return null;
  });
}
