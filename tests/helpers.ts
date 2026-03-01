import { signToken } from '../src/lib/auth';
import type { JWTPayload, MemberRole } from '../src/types';

export async function generateTestToken(overrides: Partial<JWTPayload> = {}): Promise<string> {
  const payload: JWTPayload = {
    sub: overrides.sub || '00000000-0000-0000-0000-000000000001',
    email: overrides.email || 'test@visiogold.com',
    workspaceId: overrides.workspaceId || '00000000-0000-0000-0000-000000000001',
    role: overrides.role || 'ADMIN',
  };
  return signToken(payload);
}
