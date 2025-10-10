import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { hashEmail } from '../../../lib/hash';

const usersDir = path.resolve(process.cwd(), 'data', 'users');

async function ensureUsersDir() {
  try {
    await fs.mkdir(usersDir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cid = searchParams.get('cid');
  if (!cid) return NextResponse.json({ error: 'CID is required' }, { status: 400 });
  const file = path.join(usersDir, `${cid}.json`);
  try {
    const data = await fs.readFile(file, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (err: any) {
    if (err.code === 'ENOENT') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to read user' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body || !body.email) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  await ensureUsersDir();

  // Create a deterministic-ish id from email, but include timestamp to avoid collisions when updating
  const base = hashEmail(body.email || '') || 'user';
  const cid = `${base}_${Date.now()}`;
  const file = path.join(usersDir, `${cid}.json`);

  try {
    await fs.writeFile(file, JSON.stringify(body, null, 2));
    return NextResponse.json({ cid });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save user' }, { status: 500 });
  }
}
