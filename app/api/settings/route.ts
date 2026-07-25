import { NextResponse } from 'next/server';
import { getGlobalSettings } from '@/lib/db';

export async function GET() {
  const data = await getGlobalSettings();
  return NextResponse.json(data);
}
