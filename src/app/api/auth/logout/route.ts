import { NextResponse } from 'next/server';

export async function POST() {
  // Stateless JWT: logout is client-side (discard the token).
  // This endpoint exists for API completeness and audit logging.
  return NextResponse.json({ message: 'Logged out successfully' });
}
