import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { unauthorized } from '@/lib/errors';
import type { JWTPayload } from '@/types';

/**
 * Extract and verify JWT from the Authorization header.
 * Returns the decoded JWT payload.
 */
export async function extractAuth(req: NextRequest): Promise<JWTPayload> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw unauthorized('Missing or invalid Authorization header');
  }

  const token = authHeader.substring(7);
  try {
    return await verifyToken(token);
  } catch {
    throw unauthorized('Invalid or expired token');
  }
}
