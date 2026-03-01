import { describe, it, expect } from 'vitest';
import { loginSchema, createRepoSchema, createBranchSchema, publishSchema } from '../src/lib/validation';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should accept valid login', () => {
      const result = loginSchema.safeParse({ email: 'user@test.com', password: 'password123' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({ email: 'notanemail', password: 'password123' });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = loginSchema.safeParse({ email: 'user@test.com', password: '1234567' });
      expect(result.success).toBe(false);
    });
  });

  describe('createRepoSchema', () => {
    it('should accept valid repo', () => {
      const result = createRepoSchema.safeParse({ name: 'Test Repo', slug: 'test-repo' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid slug', () => {
      const result = createRepoSchema.safeParse({ name: 'Test', slug: 'Invalid Slug!' });
      expect(result.success).toBe(false);
    });

    it('should default country and commodity', () => {
      const result = createRepoSchema.safeParse({ name: 'Test', slug: 'test' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.country).toBe('DRC');
        expect(result.data.commodity).toBe('Gold');
      }
    });
  });

  describe('createBranchSchema', () => {
    it('should accept valid branch with defaults', () => {
      const result = createBranchSchema.safeParse({ name: 'feature-branch' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.visibility).toBe('PRIVATE');
      }
    });

    it('should accept custom visibility', () => {
      const result = createBranchSchema.safeParse({ name: 'public-branch', visibility: 'PUBLIC' });
      expect(result.success).toBe(true);
    });
  });

  describe('publishSchema', () => {
    it('should accept valid publish request', () => {
      const result = publishSchema.safeParse({
        slug: 'my-snapshot',
        title: 'Published Snapshot',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid slug', () => {
      const result = publishSchema.safeParse({
        slug: 'Invalid Slug!',
        title: 'Test',
      });
      expect(result.success).toBe(false);
    });
  });
});
