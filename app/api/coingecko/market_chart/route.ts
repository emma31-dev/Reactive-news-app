import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const cg = await fetch('https://api.coingecko.com/api/v3/coins/reactive-network/market_chart?vs_currency=usd&days=1&interval=minute');
    const body = await cg.text();
    return new NextResponse(body, { status: cg.status, headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
