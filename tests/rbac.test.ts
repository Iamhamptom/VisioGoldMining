import { describe, it, expect } from 'vitest';
import { hasMinimumRole, hasPermission } from '../src/lib/rbac';

describe('RBAC', () => {
  describe('hasMinimumRole', () => {
    it('OWNER should have all roles', () => {
      expect(hasMinimumRole('OWNER', 'VIEWER')).toBe(true);
      expect(hasMinimumRole('OWNER', 'ANALYST')).toBe(true);
      expect(hasMinimumRole('OWNER', 'ADMIN')).toBe(true);
      expect(hasMinimumRole('OWNER', 'OWNER')).toBe(true);
    });

    it('VIEWER should only have VIEWER role', () => {
      expect(hasMinimumRole('VIEWER', 'VIEWER')).toBe(true);
      expect(hasMinimumRole('VIEWER', 'ANALYST')).toBe(false);
      expect(hasMinimumRole('VIEWER', 'ADMIN')).toBe(false);
      expect(hasMinimumRole('VIEWER', 'OWNER')).toBe(false);
    });

    it('ANALYST should have VIEWER and ANALYST roles', () => {
      expect(hasMinimumRole('ANALYST', 'VIEWER')).toBe(true);
      expect(hasMinimumRole('ANALYST', 'ANALYST')).toBe(true);
      expect(hasMinimumRole('ANALYST', 'ADMIN')).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('VIEWER can read repos', () => {
      expect(hasPermission('VIEWER', 'repo:read')).toBe(true);
    });

    it('VIEWER cannot create repos', () => {
      expect(hasPermission('VIEWER', 'repo:create')).toBe(false);
    });

    it('ADMIN can create repos', () => {
      expect(hasPermission('ADMIN', 'repo:create')).toBe(true);
    });

    it('ANALYST can create branches', () => {
      expect(hasPermission('ANALYST', 'branch:create')).toBe(true);
    });

    it('ANALYST cannot publish branches', () => {
      expect(hasPermission('ANALYST', 'branch:publish')).toBe(false);
    });

    it('returns false for unknown permissions', () => {
      expect(hasPermission('OWNER', 'nonexistent:action')).toBe(false);
    });
  });
});
