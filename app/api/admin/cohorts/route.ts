import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getCohorts, createCohort, deleteCohort } from '@/lib/db';



export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const cohorts = await getCohorts();
  return NextResponse.json(cohorts);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, startDate, endDate, capacity } = body;
    if (!name || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }
    const cohort = await createCohort({
      name,
      startDate,
      endDate,
      capacity: parseInt(capacity) || 20
    });
    return NextResponse.json({ success: true, data: cohort });
  } catch (error) {
    console.error('Failed to create cohort:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }
    await deleteCohort(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete cohort:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
