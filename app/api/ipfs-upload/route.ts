import { NextRequest, NextResponse } from 'next/server';
import { uploadToWeb3Storage } from '../../../lib/ipfs';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cid, url } = await uploadToWeb3Storage(body, 'data.json');
    return NextResponse.json({ cid, url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
