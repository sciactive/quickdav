import getRandomValues from 'polyfill-crypto.getrandomvalues';

if (typeof global.crypto !== 'object') {
  global.crypto = {} as Crypto;
}

if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = getRandomValues;
}
