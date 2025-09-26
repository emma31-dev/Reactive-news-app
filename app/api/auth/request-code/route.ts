import { NextResponse } from 'next/server';
import { sendVerificationEmail, getEmailTransportInfo } from '@/lib/email';

// In-memory store (per server instance) for demo purposes only.
// For production: replace with Redis / database with TTL + rate limiting.
interface CodeEntry { code: string; expiresAt: number; attempts: number; }
const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute between requests per email
// Use global maps so dev hot reload doesn't wipe pending codes between route hits
const globalAny = globalThis as any;
globalAny.__VERIFICATION_CODES__ = globalAny.__VERIFICATION_CODES__ || new Map<string, CodeEntry>();
globalAny.__VERIFICATION_LAST_REQ__ = globalAny.__VERIFICATION_LAST_REQ__ || new Map<string, number>();
const codes: Map<string, CodeEntry> = globalAny.__VERIFICATION_CODES__;
const lastRequestAt: Map<string, number> = globalAny.__VERIFICATION_LAST_REQ__;

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
      return NextResponse.json({ error: `Please wait ${retryIn}s before requesting another code.`, retryIn }, { status: 429 });
    }

    const code = generateCode();
    codes.set(email, { code, expiresAt: now + CODE_TTL_MS, attempts: 0 });
    lastRequestAt.set(email, now);

    // Attempt to send email if SMTP configured; fall back silently if not.
    let sendResult = await sendVerificationEmail(email, code);
    const includeDevCode = process.env.NODE_ENV !== 'production';
    const transportInfo = includeDevCode ? getEmailTransportInfo() : undefined;
    let verifyOk: boolean | undefined; let verifyError: string | undefined;
    if (includeDevCode && transportInfo?.mode === 'smtp' && (transportInfo as any).transporter) {
      try {
        await (transportInfo as any).transporter.verify();
        verifyOk = true;
      } catch (err: any) {
        verifyOk = false;
        verifyError = err?.message || 'verify failed';
      }
    }
    return NextResponse.json({
      success: true,
      email,
      expiresIn: CODE_TTL_MS / 1000,
      sent: sendResult.ok,
      ...(includeDevCode ? { devCode: code, transport: transportInfo?.mode, verifyOk, verifyError, sendError: sendResult.error, previewUrl: sendResult.previewUrl, from: sendResult.from, fallbackMock: sendResult.fallbackMock } : {})
    });
  } catch (e) {
    console.error('[request-code] error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// (Removed internal debug export to satisfy Next.js route type constraints)
