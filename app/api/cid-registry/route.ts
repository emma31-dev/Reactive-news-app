import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const cidRegistryPath = path.resolve(process.cwd(), 'data', 'cid.json');

async function getCidRegistry(): Promise<Record<string, string>> {
  try {
    const data = await fs.readFile(cidRegistryPath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return {}; // File not found, return empty registry
    }
    throw error;
  }
}

async function saveCidRegistry(registry: Record<string, string>) {
  await fs.writeFile(cidRegistryPath, JSON.stringify(registry, null, 2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const registry = await getCidRegistry();

  if (username) {
    const cid = registry[username];
    if (cid) {
      return NextResponse.json({ cid });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  }

  return NextResponse.json(registry);
}

export async function POST(request: Request) {
  const { username, cid } = await request.json();

  if (!username || !cid) {
    return NextResponse.json({ error: 'Username and CID are required' }, { status: 400 });
  }

  const registry = await getCidRegistry();
  registry[username] = cid;
  await saveCidRegistry(registry);

  return NextResponse.json({ success: true, cid });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const registry = await getCidRegistry();
    if (registry[username]) {
        delete registry[username];
        await saveCidRegistry(registry);
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
}