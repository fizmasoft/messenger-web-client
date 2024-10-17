import CryptoJS from 'crypto-js';
// import crypto, { CipherCCMTypes, CipherGCMTypes, CipherOCBTypes } from 'crypto';

const cryptoSecret =
  '$2$2b$10$XfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVMXdG9L3GbIubP2ME$2b$10$XfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVGXfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVMXdG9L3G';

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

// function AesUtil(keySize: number, iterationCount: number) {
//   keySize = keySize / 32;
//   iterationCount = iterationCount;

//   function generateKey(salt: string, passPhrase: string) {
//     const key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
//       keySize: keySize,
//       iterations: iterationCount,
//     });
//     return key;
//   }

//   function encrypt(salt: string, iv: string, passPhrase: string, plainText: string) {
//     const key = generateKey(salt, passPhrase);
//     const encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: CryptoJS.enc.Hex.parse(iv) });
//     return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//   }

//   function decrypt(salt: string, iv: string, passPhrase: string, cipherText: string) {
//     const key = generateKey(salt, passPhrase);
//     const cipherParams = CryptoJS.lib.CipherParams.create({
//       ciphertext: CryptoJS.enc.Base64.parse(cipherText),
//     });
//     const decrypted = CryptoJS.AES.decrypt(cipherParams, '1234567891230456', {
//       iv: CryptoJS.enc.Hex.parse(iv),
//     });

//     return decrypted.toString(CryptoJS.enc.Utf8);
//   }

//   return {
//     generateKey,
//     encrypt,
//     decrypt,
//   };
// }


// function f2() {
//   // const key = '1234567891230456';
//   // const algorithm: CipherCCMTypes | CipherGCMTypes | CipherOCBTypes = 'aes-256-gcm'; // aes-256-cbc
//   const algorithm = 'aes-256-cbc';
//   const key = crypto.randomBytes(32); // Shifrlash uchun kalit
//   const iv = crypto.randomBytes(16); // Inicializatsiya vektori

//   function encrypt(text) {
//     let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
//     let encrypted = cipher.update(text, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     return {
//       iv: iv.toString('hex'),
//       encryptedData: encrypted,
//     };
//   }

//   function decrypt(encryptedData, secret = key) {
//     let decipher = crypto.createDecipheriv(
//       algorithm,
//       Buffer.from(secret),
//       Buffer.from(encryptedData.iv, 'hex'),
//     );
//     let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
//   }

//   // Misol
//   const textToEncrypt = 'Salom, bu shifrlash testidir!';
//   const encrypted = encrypt(textToEncrypt);
//   console.log({
//     key,
//     keyString: key.toString('base64'),
//     iv,
//     ivString: iv.toString('base64'),
//   });

//   console.log('Shifrlangan:', encrypted);

//   const decrypted = decrypt(encrypted);
//   console.log('Deshifrlangan:', decrypted);
// }
