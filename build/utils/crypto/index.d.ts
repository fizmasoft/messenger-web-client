/**
 * Encrypt data
 * @param data - data
 */
export declare function encrypt<T = unknown>(data: T, secret?: string): string;
/**
 * Decrypt data
 * @param cipherText - cipher text
 */
export declare function decrypt<T = unknown>(cipherText: string, secret?: string): T | null;
