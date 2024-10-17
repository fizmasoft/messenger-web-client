import CryptoJS from 'crypto-js';
// import crypto, { CipherCCMTypes, CipherGCMTypes, CipherOCBTypes } from 'crypto';
const cryptoSecret = '$2$2b$10$XfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVMXdG9L3GbIubP2ME$2b$10$XfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVGXfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVMXdG9L3G';
/**
 * Encrypt data
 * @param data - data
 */
export function encrypt(data, secret = cryptoSecret) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), 
    // CryptoJS.lib.WordArray.create(serialize(data).buffer),
    secret).toString();
}
/**
 * Decrypt data
 * @param cipherText - cipher text
 */
export function decrypt(cipherText, secret = cryptoSecret) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvY3J5cHRvL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sUUFBUSxNQUFNLFdBQVcsQ0FBQztBQUNqQyxtRkFBbUY7QUFFbkYsTUFBTSxZQUFZLEdBQ2hCLGtMQUFrTCxDQUFDO0FBRXJMOzs7R0FHRztBQUNILE1BQU0sVUFBVSxPQUFPLENBQWMsSUFBTyxFQUFFLE1BQU0sR0FBRyxZQUFZO0lBQ2pFLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO0lBQ3BCLHlEQUF5RDtJQUN6RCxNQUFNLENBQ1AsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNmLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsT0FBTyxDQUFjLFVBQWtCLEVBQUUsTUFBTSxHQUFHLFlBQVk7SUFDNUUsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RCxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsOERBQThEO0FBQzlELDRCQUE0QjtBQUM1QixxQ0FBcUM7QUFFckMsNkRBQTZEO0FBQzdELDhFQUE4RTtBQUM5RSwwQkFBMEI7QUFDMUIsb0NBQW9DO0FBQ3BDLFVBQVU7QUFDVixrQkFBa0I7QUFDbEIsTUFBTTtBQUVOLHdGQUF3RjtBQUN4RixpREFBaUQ7QUFDakQsa0dBQWtHO0FBQ2xHLGlFQUFpRTtBQUNqRSxNQUFNO0FBRU4seUZBQXlGO0FBQ3pGLGlEQUFpRDtBQUNqRCw4REFBOEQ7QUFDOUQsMkRBQTJEO0FBQzNELFVBQVU7QUFDVixpRkFBaUY7QUFDakYsd0NBQXdDO0FBQ3hDLFVBQVU7QUFFVixvREFBb0Q7QUFDcEQsTUFBTTtBQUVOLGFBQWE7QUFDYixtQkFBbUI7QUFDbkIsZUFBZTtBQUNmLGVBQWU7QUFDZixPQUFPO0FBQ1AsSUFBSTtBQUdKLGtCQUFrQjtBQUNsQix1Q0FBdUM7QUFDdkMseUdBQXlHO0FBQ3pHLHFDQUFxQztBQUNyQyxpRUFBaUU7QUFDakUsa0VBQWtFO0FBRWxFLDZCQUE2QjtBQUM3QiwyRUFBMkU7QUFDM0UsMERBQTBEO0FBQzFELHdDQUF3QztBQUN4QyxlQUFlO0FBQ2YsZ0NBQWdDO0FBQ2hDLGtDQUFrQztBQUNsQyxTQUFTO0FBQ1QsTUFBTTtBQUVOLG9EQUFvRDtBQUNwRCw4Q0FBOEM7QUFDOUMsbUJBQW1CO0FBQ25CLDZCQUE2QjtBQUM3Qiw4Q0FBOEM7QUFDOUMsU0FBUztBQUNULG1GQUFtRjtBQUNuRiwyQ0FBMkM7QUFDM0Msd0JBQXdCO0FBQ3hCLE1BQU07QUFFTixhQUFhO0FBQ2IsMkRBQTJEO0FBQzNELDhDQUE4QztBQUM5QyxrQkFBa0I7QUFDbEIsV0FBVztBQUNYLHlDQUF5QztBQUN6QyxVQUFVO0FBQ1YsdUNBQXVDO0FBQ3ZDLFFBQVE7QUFFUiw0Q0FBNEM7QUFFNUMsMENBQTBDO0FBQzFDLDhDQUE4QztBQUM5QyxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENyeXB0b0pTIGZyb20gJ2NyeXB0by1qcyc7XHJcbi8vIGltcG9ydCBjcnlwdG8sIHsgQ2lwaGVyQ0NNVHlwZXMsIENpcGhlckdDTVR5cGVzLCBDaXBoZXJPQ0JUeXBlcyB9IGZyb20gJ2NyeXB0byc7XHJcblxyXG5jb25zdCBjcnlwdG9TZWNyZXQgPVxyXG4gICckMiQyYiQxMCRYZktEaFFBUWlwSGJJdWJQMk1FQW1PTC9Hcnd1Yzc5SU14VjF4YnFwVUdZQVZNWGRHOUwzR2JJdWJQMk1FJDJiJDEwJFhmS0RoUUFRaXBIYkl1YlAyTUVBbU9ML0dyd3VjNzlJTXhWMXhicXBVR1lBVkdYZktEaFFBUWlwSGJJdWJQMk1FQW1PTC9Hcnd1Yzc5SU14VjF4YnFwVUdZQVZNWGRHOUwzRyc7XHJcblxyXG4vKipcclxuICogRW5jcnlwdCBkYXRhXHJcbiAqIEBwYXJhbSBkYXRhIC0gZGF0YVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGVuY3J5cHQ8VCA9IHVua25vd24+KGRhdGE6IFQsIHNlY3JldCA9IGNyeXB0b1NlY3JldCkge1xyXG4gIHJldHVybiBDcnlwdG9KUy5BRVMuZW5jcnlwdChcclxuICAgIEpTT04uc3RyaW5naWZ5KGRhdGEpLFxyXG4gICAgLy8gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoc2VyaWFsaXplKGRhdGEpLmJ1ZmZlciksXHJcbiAgICBzZWNyZXQsXHJcbiAgKS50b1N0cmluZygpO1xyXG59XHJcblxyXG4vKipcclxuICogRGVjcnlwdCBkYXRhXHJcbiAqIEBwYXJhbSBjaXBoZXJUZXh0IC0gY2lwaGVyIHRleHRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0PFQgPSB1bmtub3duPihjaXBoZXJUZXh0OiBzdHJpbmcsIHNlY3JldCA9IGNyeXB0b1NlY3JldCk6IFQgfCBudWxsIHtcclxuICBjb25zdCBieXRlcyA9IENyeXB0b0pTLkFFUy5kZWNyeXB0KGNpcGhlclRleHQsIHNlY3JldCk7XHJcbiAgY29uc3Qgb3JpZ2luYWxUZXh0ID0gYnl0ZXMudG9TdHJpbmcoQ3J5cHRvSlMuZW5jLlV0ZjgpO1xyXG4gIGlmIChvcmlnaW5hbFRleHQpIHtcclxuICAgIHJldHVybiBKU09OLnBhcnNlKG9yaWdpbmFsVGV4dCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLy8gZnVuY3Rpb24gQWVzVXRpbChrZXlTaXplOiBudW1iZXIsIGl0ZXJhdGlvbkNvdW50OiBudW1iZXIpIHtcclxuLy8gICBrZXlTaXplID0ga2V5U2l6ZSAvIDMyO1xyXG4vLyAgIGl0ZXJhdGlvbkNvdW50ID0gaXRlcmF0aW9uQ291bnQ7XHJcblxyXG4vLyAgIGZ1bmN0aW9uIGdlbmVyYXRlS2V5KHNhbHQ6IHN0cmluZywgcGFzc1BocmFzZTogc3RyaW5nKSB7XHJcbi8vICAgICBjb25zdCBrZXkgPSBDcnlwdG9KUy5QQktERjIocGFzc1BocmFzZSwgQ3J5cHRvSlMuZW5jLkhleC5wYXJzZShzYWx0KSwge1xyXG4vLyAgICAgICBrZXlTaXplOiBrZXlTaXplLFxyXG4vLyAgICAgICBpdGVyYXRpb25zOiBpdGVyYXRpb25Db3VudCxcclxuLy8gICAgIH0pO1xyXG4vLyAgICAgcmV0dXJuIGtleTtcclxuLy8gICB9XHJcblxyXG4vLyAgIGZ1bmN0aW9uIGVuY3J5cHQoc2FsdDogc3RyaW5nLCBpdjogc3RyaW5nLCBwYXNzUGhyYXNlOiBzdHJpbmcsIHBsYWluVGV4dDogc3RyaW5nKSB7XHJcbi8vICAgICBjb25zdCBrZXkgPSBnZW5lcmF0ZUtleShzYWx0LCBwYXNzUGhyYXNlKTtcclxuLy8gICAgIGNvbnN0IGVuY3J5cHRlZCA9IENyeXB0b0pTLkFFUy5lbmNyeXB0KHBsYWluVGV4dCwga2V5LCB7IGl2OiBDcnlwdG9KUy5lbmMuSGV4LnBhcnNlKGl2KSB9KTtcclxuLy8gICAgIHJldHVybiBlbmNyeXB0ZWQuY2lwaGVydGV4dC50b1N0cmluZyhDcnlwdG9KUy5lbmMuQmFzZTY0KTtcclxuLy8gICB9XHJcblxyXG4vLyAgIGZ1bmN0aW9uIGRlY3J5cHQoc2FsdDogc3RyaW5nLCBpdjogc3RyaW5nLCBwYXNzUGhyYXNlOiBzdHJpbmcsIGNpcGhlclRleHQ6IHN0cmluZykge1xyXG4vLyAgICAgY29uc3Qga2V5ID0gZ2VuZXJhdGVLZXkoc2FsdCwgcGFzc1BocmFzZSk7XHJcbi8vICAgICBjb25zdCBjaXBoZXJQYXJhbXMgPSBDcnlwdG9KUy5saWIuQ2lwaGVyUGFyYW1zLmNyZWF0ZSh7XHJcbi8vICAgICAgIGNpcGhlcnRleHQ6IENyeXB0b0pTLmVuYy5CYXNlNjQucGFyc2UoY2lwaGVyVGV4dCksXHJcbi8vICAgICB9KTtcclxuLy8gICAgIGNvbnN0IGRlY3J5cHRlZCA9IENyeXB0b0pTLkFFUy5kZWNyeXB0KGNpcGhlclBhcmFtcywgJzEyMzQ1Njc4OTEyMzA0NTYnLCB7XHJcbi8vICAgICAgIGl2OiBDcnlwdG9KUy5lbmMuSGV4LnBhcnNlKGl2KSxcclxuLy8gICAgIH0pO1xyXG5cclxuLy8gICAgIHJldHVybiBkZWNyeXB0ZWQudG9TdHJpbmcoQ3J5cHRvSlMuZW5jLlV0ZjgpO1xyXG4vLyAgIH1cclxuXHJcbi8vICAgcmV0dXJuIHtcclxuLy8gICAgIGdlbmVyYXRlS2V5LFxyXG4vLyAgICAgZW5jcnlwdCxcclxuLy8gICAgIGRlY3J5cHQsXHJcbi8vICAgfTtcclxuLy8gfVxyXG5cclxuXHJcbi8vIGZ1bmN0aW9uIGYyKCkge1xyXG4vLyAgIC8vIGNvbnN0IGtleSA9ICcxMjM0NTY3ODkxMjMwNDU2JztcclxuLy8gICAvLyBjb25zdCBhbGdvcml0aG06IENpcGhlckNDTVR5cGVzIHwgQ2lwaGVyR0NNVHlwZXMgfCBDaXBoZXJPQ0JUeXBlcyA9ICdhZXMtMjU2LWdjbSc7IC8vIGFlcy0yNTYtY2JjXHJcbi8vICAgY29uc3QgYWxnb3JpdGhtID0gJ2Flcy0yNTYtY2JjJztcclxuLy8gICBjb25zdCBrZXkgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoMzIpOyAvLyBTaGlmcmxhc2ggdWNodW4ga2FsaXRcclxuLy8gICBjb25zdCBpdiA9IGNyeXB0by5yYW5kb21CeXRlcygxNik7IC8vIEluaWNpYWxpemF0c2l5YSB2ZWt0b3JpXHJcblxyXG4vLyAgIGZ1bmN0aW9uIGVuY3J5cHQodGV4dCkge1xyXG4vLyAgICAgbGV0IGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdihhbGdvcml0aG0sIEJ1ZmZlci5mcm9tKGtleSksIGl2KTtcclxuLy8gICAgIGxldCBlbmNyeXB0ZWQgPSBjaXBoZXIudXBkYXRlKHRleHQsICd1dGY4JywgJ2hleCcpO1xyXG4vLyAgICAgZW5jcnlwdGVkICs9IGNpcGhlci5maW5hbCgnaGV4Jyk7XHJcbi8vICAgICByZXR1cm4ge1xyXG4vLyAgICAgICBpdjogaXYudG9TdHJpbmcoJ2hleCcpLFxyXG4vLyAgICAgICBlbmNyeXB0ZWREYXRhOiBlbmNyeXB0ZWQsXHJcbi8vICAgICB9O1xyXG4vLyAgIH1cclxuXHJcbi8vICAgZnVuY3Rpb24gZGVjcnlwdChlbmNyeXB0ZWREYXRhLCBzZWNyZXQgPSBrZXkpIHtcclxuLy8gICAgIGxldCBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KFxyXG4vLyAgICAgICBhbGdvcml0aG0sXHJcbi8vICAgICAgIEJ1ZmZlci5mcm9tKHNlY3JldCksXHJcbi8vICAgICAgIEJ1ZmZlci5mcm9tKGVuY3J5cHRlZERhdGEuaXYsICdoZXgnKSxcclxuLy8gICAgICk7XHJcbi8vICAgICBsZXQgZGVjcnlwdGVkID0gZGVjaXBoZXIudXBkYXRlKGVuY3J5cHRlZERhdGEuZW5jcnlwdGVkRGF0YSwgJ2hleCcsICd1dGY4Jyk7XHJcbi8vICAgICBkZWNyeXB0ZWQgKz0gZGVjaXBoZXIuZmluYWwoJ3V0ZjgnKTtcclxuLy8gICAgIHJldHVybiBkZWNyeXB0ZWQ7XHJcbi8vICAgfVxyXG5cclxuLy8gICAvLyBNaXNvbFxyXG4vLyAgIGNvbnN0IHRleHRUb0VuY3J5cHQgPSAnU2Fsb20sIGJ1IHNoaWZybGFzaCB0ZXN0aWRpciEnO1xyXG4vLyAgIGNvbnN0IGVuY3J5cHRlZCA9IGVuY3J5cHQodGV4dFRvRW5jcnlwdCk7XHJcbi8vICAgY29uc29sZS5sb2coe1xyXG4vLyAgICAga2V5LFxyXG4vLyAgICAga2V5U3RyaW5nOiBrZXkudG9TdHJpbmcoJ2Jhc2U2NCcpLFxyXG4vLyAgICAgaXYsXHJcbi8vICAgICBpdlN0cmluZzogaXYudG9TdHJpbmcoJ2Jhc2U2NCcpLFxyXG4vLyAgIH0pO1xyXG5cclxuLy8gICBjb25zb2xlLmxvZygnU2hpZnJsYW5nYW46JywgZW5jcnlwdGVkKTtcclxuXHJcbi8vICAgY29uc3QgZGVjcnlwdGVkID0gZGVjcnlwdChlbmNyeXB0ZWQpO1xyXG4vLyAgIGNvbnNvbGUubG9nKCdEZXNoaWZybGFuZ2FuOicsIGRlY3J5cHRlZCk7XHJcbi8vIH1cclxuIl19