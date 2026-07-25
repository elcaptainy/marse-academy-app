import { NextRequest, NextResponse } from 'next/server';
import { getCohorts } from '@/lib/db';

export async function GET() {
  try {
    const cohorts = await getCohorts();
    // Filter to only show active classes/cohorts
    const activeCohorts = cohorts.filter((c: any) => c.status !== 'Completed');
    return NextResponse.json(activeCohorts);
  } catch (error) {
    console.error('Failed to fetch public cohorts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
