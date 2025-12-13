import { hash, verify } from 'argon2';

export const hashString = async (raw: string): Promise<string> => {
  return hash(raw, { timeCost: 2, memoryCost: 15360, parallelism: 1 });
};

export const compareHashString = async (
  hash: string,
  raw: string,
): Promise<boolean> => {
  return verify(hash, raw);
};
