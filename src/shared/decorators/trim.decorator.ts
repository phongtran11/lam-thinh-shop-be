import { Transform } from 'class-transformer';

interface TrimOptions {
  isArray?: boolean;
  trimEmptyToUndefined?: boolean; // optional enhancement
}

export function Trim(options: TrimOptions = {}): PropertyDecorator {
  const { isArray = false, trimEmptyToUndefined = false } = options;

  return Transform(
    ({ value }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      if (value == null) return value; // null or undefined pass through

      if (isArray && Array.isArray(value)) {
        const trimmed = value.map((v) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          typeof v === 'string' ? v.trim() : v,
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return trimEmptyToUndefined
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            trimmed.map((v) => (v === '' ? undefined : v))
          : trimmed;
      }

      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimEmptyToUndefined && trimmed === '' ? undefined : trimmed;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value;
    },
    { toClassOnly: true }, // only when binding inbound data
  );
}
