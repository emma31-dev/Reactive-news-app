import { NextResponse } from 'next/server';

// In-memory store (per server instance) for demo purposes only.
// For production: replace with Redis / database with TTL + rate limiting.
interface CodeEntry { code: string; expiresAt: number; attempts: number; }
const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute between requests per email
const codes = new Map<string, CodeEntry>();
const lastRequestAt = new Map<string, number>();

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').toString().trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const now = Date.now();
    const last = lastRequestAt.get(email) || 0;
    if (now - last < RATE_LIMIT_WINDOW_MS) {
      const retryIn = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - last)) / 1000);
      return NextResponse.json({ error: `Please wait ${retryIn}s before requesting another code.` }, { status: 429 });
    }

    const code = generateCode();
    codes.set(email, { code, expiresAt: now + CODE_TTL_MS, attempts: 0 });
    lastRequestAt.set(email, now);

    // In a real system we would send email here.
    // For development, expose code so it can be displayed to user.
    const dev = process.env.NODE_ENV !== 'production';
    return NextResponse.json({ success: true, email, expiresIn: CODE_TTL_MS / 1000, ...(dev ? { devCode: code } : {}) });
  } catch (e) {
    console.error('[request-code] error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Utility for other modules (not imported client-side)
export function _peekCode(email: string) { return codes.get(email); }
