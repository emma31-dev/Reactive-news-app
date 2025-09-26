import { NextResponse } from 'next/server';

interface CodeEntry { code: string; expiresAt: number; attempts: number; }
// We reuse the map instance attached to the globalThis to survive hot reloads in dev
const globalAny = globalThis as any;
globalAny.__VERIFICATION_CODES__ = globalAny.__VERIFICATION_CODES__ || new Map<string, CodeEntry>();
const codes: Map<string, CodeEntry> = globalAny.__VERIFICATION_CODES__;

const MAX_ATTEMPTS = 5;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').toString().trim().toLowerCase();
    const code = (body.code || '').toString().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (!/^[0-9]{6}$/.test(code)) {
      return NextResponse.json({ error: 'Invalid code format' }, { status: 400 });
    }

    const entry = codes.get(email);
    if (!entry) {
      return NextResponse.json({ error: 'No code requested for this email' }, { status: 404 });
    }
    if (Date.now() > entry.expiresAt) {
      codes.delete(email);
      return NextResponse.json({ error: 'Code expired' }, { status: 410 });
    }
    if (entry.attempts >= MAX_ATTEMPTS) {
      codes.delete(email);
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
    }
    entry.attempts++;
    if (entry.code !== code) {
      return NextResponse.json({ error: 'Incorrect code', remaining: MAX_ATTEMPTS - entry.attempts }, { status: 401 });
    }
    // Success
    codes.delete(email); // One-time use
    return NextResponse.json({ success: true, email, verified: true });
  } catch (e) {
    console.error('[verify-code] error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
