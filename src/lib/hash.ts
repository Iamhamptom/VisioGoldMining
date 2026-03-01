import crypto from 'crypto';

/**
 * Compute SHA-256 hash of a buffer, returned as hex string.
 */
export function sha256(data: Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}
