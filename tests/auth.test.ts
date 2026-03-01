import { describe, it, expect } from 'vitest';
import { signToken, verifyToken, hashPassword, comparePassword } from '../src/lib/auth';
import type { JWTPayload } from '../src/types';

describe('Auth', () => {
  describe('JWT', () => {
    const testPayload: JWTPayload = {
      sub: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      workspaceId: '123e4567-e89b-12d3-a456-426614174001',
      role: 'ADMIN',
    };

    it('should sign and verify a token', async () => {
      const token = await signToken(testPayload);
      expect(token).toBeTruthy();

      const decoded = await verifyToken(token);
      expect(decoded.sub).toBe(testPayload.sub);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.workspaceId).toBe(testPayload.workspaceId);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should reject an invalid token', async () => {
      await expect(verifyToken('invalid.token.here')).rejects.toThrow();
    });

    it('should reject a tampered token', async () => {
      const token = await signToken(testPayload);
      const tampered = token.slice(0, -5) + 'XXXXX';
      await expect(verifyToken(tampered)).rejects.toThrow();
    });
  });

  describe('Password', () => {
    it('should hash and verify a password', async () => {
      const password = 'securePassword123!';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(await comparePassword(password, hash)).toBe(true);
    });

    it('should reject wrong password', async () => {
      const hash = await hashPassword('correctPassword');
      expect(await comparePassword('wrongPassword', hash)).toBe(false);
    });
  });
});
