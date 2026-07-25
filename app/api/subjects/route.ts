import { NextResponse } from 'next/server';
import { getCoreSubjects } from '@/lib/db';

export async function GET() {
  const data = await getCoreSubjects();
  return NextResponse.json(data);
}
