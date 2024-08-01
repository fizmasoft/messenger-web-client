import CryptoJS from 'crypto-js';
import { v1 as uuidV1 } from 'uuid';
// import { serialize } from 'v8';

const cryptoSecret = uuidV1();

/**
 * Encrypt data
 * @param data - data
 */
export function encrypt<T = unknown>(data: T) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    // CryptoJS.lib.WordArray.create(serialize(data).buffer),
    cryptoSecret,
  ).toString();
}

/**
 * Decrypt data
 * @param cipherText - cipher text
 */
export function decrypt<T = unknown>(cipherText: string): T | null {
  const bytes = CryptoJS.AES.decrypt(cipherText, cryptoSecret);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  if (originalText) {
    return JSON.parse(originalText);
  }

  return null;
}
