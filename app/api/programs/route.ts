import { NextRequest, NextResponse } from 'next/server';
import { getPrograms } from '@/lib/db';

export async function GET() {
  try {
    const list = await getPrograms();
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch programs list' }, { status: 500 });
  }
}
