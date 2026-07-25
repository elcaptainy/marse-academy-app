import { NextResponse } from 'next/server';
import { getJourneySteps } from '@/lib/db';

export async function GET() {
  const data = await getJourneySteps();
  return NextResponse.json(data);
}
