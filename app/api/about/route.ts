import { NextResponse } from 'next/server';
import { getAboutSettings } from '@/lib/db';

export async function GET() {
  const data = await getAboutSettings();
  return NextResponse.json(data);
}
