import { NextResponse } from 'next/server';

// Email verification removed from application. Endpoint deprecated.
export async function POST() {
  return NextResponse.json({ error: 'Email verification removed' }, { status: 410 });
}
