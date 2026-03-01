import { describe, it, expect } from 'vitest';
import { generateDEK, encrypt, decrypt } from '../src/lib/crypto';

describe('Encryption', () => {
  it('should generate a 256-bit DEK', () => {
    const dek = generateDEK();
    expect(dek.length).toBe(32); // 256 bits
  });

  it('should encrypt and decrypt data round-trip', () => {
    const key = generateDEK();
    const plaintext = Buffer.from('Hello, VisioGold! This is sensitive mining data.');

    const encrypted = encrypt(plaintext, key);
    expect(encrypted).not.toEqual(plaintext);
    expect(encrypted.length).toBeGreaterThan(plaintext.length);

    const decrypted = decrypt(encrypted, key);
    expect(decrypted).toEqual(plaintext);
  });

  it('should fail decryption with wrong key', () => {
    const key1 = generateDEK();
    const key2 = generateDEK();
    const plaintext = Buffer.from('Sensitive data');

    const encrypted = encrypt(plaintext, key1);
    expect(() => decrypt(encrypted, key2)).toThrow();
  });

  it('should fail decryption with tampered data', () => {
    const key = generateDEK();
    const plaintext = Buffer.from('Sensitive data');

    const encrypted = encrypt(plaintext, key);
    // Tamper with the ciphertext
    encrypted[20] ^= 0xff;

    expect(() => decrypt(encrypted, key)).toThrow();
  });
});
