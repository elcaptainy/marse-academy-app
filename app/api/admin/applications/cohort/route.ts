import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { updateApplicationCohort } from '@/lib/db';



export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, cohortId } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Application ID is required' }, { status: 400 });
    }
    const app = await updateApplicationCohort(id, cohortId || null);
    return NextResponse.json({ success: true, data: app });
  } catch (error) {
    console.error('Failed to update student cohort assignment:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
