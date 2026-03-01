import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * Generate a random 256-bit data encryption key (DEK).
 */
export function generateDEK(): Buffer {
  return crypto.randomBytes(32);
}

/**
 * Encrypt data using AES-256-GCM with the given key.
 * Returns a buffer containing: IV (12 bytes) + ciphertext + auth tag (16 bytes)
 */
export function encrypt(data: Buffer, key: Buffer): Buffer {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, encrypted, tag]);
}

/**
 * Decrypt data encrypted with AES-256-GCM.
 * Expects input: IV (12 bytes) + ciphertext + auth tag (16 bytes)
 */
export function decrypt(encryptedData: Buffer, key: Buffer): Buffer {
  const iv = encryptedData.subarray(0, IV_LENGTH);
  const tag = encryptedData.subarray(encryptedData.length - TAG_LENGTH);
  const ciphertext = encryptedData.subarray(IV_LENGTH, encryptedData.length - TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

/**
 * Encrypt a DEK with the root encryption key (from env var).
 */
export function encryptDEK(dek: Buffer): Buffer {
  const rootKey = Buffer.from(
    process.env.ROOT_ENCRYPTION_KEY || 'dev-root-key-32-bytes-long!!!!!',
    'utf-8'
  ).subarray(0, 32);
  return encrypt(dek, rootKey);
}

/**
 * Decrypt a DEK using the root encryption key.
 */
export function decryptDEK(encryptedDek: Buffer): Buffer {
  const rootKey = Buffer.from(
    process.env.ROOT_ENCRYPTION_KEY || 'dev-root-key-32-bytes-long!!!!!',
    'utf-8'
  ).subarray(0, 32);
  return decrypt(encryptedDek, rootKey);
}
