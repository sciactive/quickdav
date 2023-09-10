import { customAlphabet } from 'nanoid';
import { nolookalikesSafe } from 'nanoid-dictionary';

export const passgen = customAlphabet(
  nolookalikesSafe
    .split('')
    .filter((letter) => letter.toLowerCase() === letter)
    .join(''),
  5
);
