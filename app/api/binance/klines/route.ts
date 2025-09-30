import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol') || 'REACTUSDT';
    const interval = url.searchParams.get('interval') || '1m';
    const limit = url.searchParams.get('limit') || '200';
    const api = `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=${encodeURIComponent(limit)}`;
    const res = await fetch(api);
    const body = await res.text();
    return new NextResponse(body, { status: res.status, headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
