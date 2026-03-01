import { describe, it, expect } from 'vitest';
import { sha256 } from '../src/lib/hash';

describe('SHA-256 Hashing', () => {
  it('should produce a 64-char hex string', () => {
    const hash = sha256(Buffer.from('test data'));
    expect(hash.length).toBe(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should produce consistent hashes', () => {
    const data = Buffer.from('consistent data');
    expect(sha256(data)).toBe(sha256(data));
  });

  it('should produce different hashes for different data', () => {
    expect(sha256(Buffer.from('data1'))).not.toBe(sha256(Buffer.from('data2')));
  });
});
