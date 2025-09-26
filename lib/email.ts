import nodemailer from 'nodemailer';

/**
 * Build (and cache) a Nodemailer transporter if SMTP env vars are present.
 * Falls back to null if configuration is incomplete so callers can degrade gracefully.
 */
let cachedTransport: nodemailer.Transporter | null | undefined;
interface TransportInfo { mode: string; detail?: any; transporter?: nodemailer.Transporter; etherealUser?: string; }
let cachedTransportInfo: TransportInfo | null = null;

export async function getEmailTransport() {
  if (cachedTransport !== undefined) return cachedTransport;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, NODE_ENV } = process.env;
  if (!SMTP_HOST || !SMTP_PORT) {
    // Development convenience: create a one-off Ethereal test account if in dev
    if (NODE_ENV !== 'production') {
      try {
        const testAccount = await nodemailer.createTestAccount();
        cachedTransport = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: { user: testAccount.user, pass: testAccount.pass }
        });
  cachedTransportInfo = { mode: 'ethereal', detail: { user: testAccount.user }, transporter: cachedTransport };
        return cachedTransport;
      } catch (e) {
        console.warn('[email] could not create Ethereal test account', e);
      }
    }
    cachedTransport = null;
    cachedTransportInfo = { mode: 'disabled' };
    return cachedTransport;
  }
  try {
    cachedTransport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === 'true',
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
  cachedTransportInfo = { mode: 'smtp', detail: { host: SMTP_HOST }, transporter: cachedTransport };
  } catch (e) {
    console.error('[email] failed creating transporter', e);
    cachedTransport = null;
  cachedTransportInfo = { mode: 'error', detail: (e as any)?.message };
  }
  return cachedTransport;
}

export interface SendEmailResult {
  ok: boolean;
  error?: string;
  previewUrl?: string;
  from?: string;
  mode: string;
  fallbackMock?: boolean;
}

export async function sendVerificationEmail(to: string, code: string): Promise<SendEmailResult> {
  const transport = await getEmailTransport();
  const mode = cachedTransportInfo?.mode || 'unknown';
  if (!transport) return { ok: false, error: 'No transport (disabled)', mode };
  // Prefer a realistic from. For Ethereal we use the generated account user.
  const from = (mode === 'ethereal' && cachedTransportInfo?.detail?.user)
    ? cachedTransportInfo.detail.user
    : (process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com');
  const subject = 'Your Verification Code';
  const text = `Your verification code is: ${code}\nThis code will expire in 5 minutes.`;
  const html = `<p>Your verification code is:</p><p style=\"font-size:20px;font-weight:bold;letter-spacing:4px;\">${code}</p><p>This code will expire in 5 minutes.</p>`;
  try {
    const info = await transport.sendMail({ from, to, subject, text, html });
    let previewUrl: string | undefined;
    if (mode === 'ethereal') {
      previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
      if (previewUrl) console.log('[email] ethereal preview URL:', previewUrl);
    }
    return { ok: true, previewUrl, from, mode };
  } catch (e: any) {
    console.error('[email] send failed', e);
    const allowMock = process.env.ALLOW_DEV_EMAIL_MOCK === 'true' && process.env.NODE_ENV !== 'production';
    const msg = e?.message || '';
    const timeoutLike = /ETIMEDOUT|ESOCKET|ECONNREFUSED|ENETUNREACH/i.test(msg);
    if (allowMock && timeoutLike) {
      const previewUrl = `mock://email/verification?code=${code}`;
      console.warn('[email] using mock fallback delivery (no real SMTP connection)');
      return { ok: true, previewUrl, from, mode: mode + '-mock', fallbackMock: true };
    }
    return { ok: false, error: msg || 'unknown error', from, mode };
  }
}

export function getEmailTransportInfo() {
  return cachedTransportInfo;
}
