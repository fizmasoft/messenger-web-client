import CryptoJS from 'crypto-js';
// import { serialize } from 'v8';

const cryptoSecret = '$2$2b$10$XfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVMXdG9L3GbIubP2ME$2b$10$XfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVGXfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVMXdG9L3G';

/**
 * Encrypt data
 * @param data - data
 */
export function encrypt<T = unknown>(data: T, secret = cryptoSecret) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    // CryptoJS.lib.WordArray.create(serialize(data).buffer),
    secret,
  ).toString();
}

/**
 * Decrypt data
 * @param cipherText - cipher text
 */
export function decrypt<T = unknown>(cipherText: string, secret = cryptoSecret): T | null {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  if (originalText) {
    return JSON.parse(originalText);
  }

  return null;
}
