import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || '';

export function encryptText(plainText: string): string {
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
}

export function decryptText(encryptedText: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting text:', error);
    return '';
  }
}