import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Proxy CoinGecko OHLC for reactive-network
    const cg = await fetch('https://api.coingecko.com/api/v3/coins/reactive-network/ohlc?vs_currency=usd&days=1');
    const body = await cg.text();
    return new NextResponse(body, { status: cg.status, headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
