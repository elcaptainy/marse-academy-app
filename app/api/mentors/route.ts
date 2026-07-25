import { NextResponse } from 'next/server';
import { getMentors } from '@/lib/db';

export async function GET() {
  const data = await getMentors();
  return NextResponse.json(data);
}
