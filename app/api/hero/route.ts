import { NextResponse } from 'next/server';
import { getHeroSettings } from '@/lib/db';

export async function GET() {
  const data = await getHeroSettings();
  return NextResponse.json(data);
}
