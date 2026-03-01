import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import type { JWTPayload } from '@/types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production-min-32-chars!'
);

const JWT_EXPIRY = process.env.JWT_EXPIRY || '15m';

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return {
    sub: payload.sub as string,
    email: payload.email as string,
    workspaceId: payload.workspaceId as string,
    role: payload.role as JWTPayload['role'],
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
