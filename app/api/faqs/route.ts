import { NextResponse } from 'next/server';
import { getFAQs } from '@/lib/db';

export async function GET() {
  const data = await getFAQs();
  return NextResponse.json(data);
}
