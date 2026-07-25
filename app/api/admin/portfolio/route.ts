import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { updateStudentPortfolioAndGrading } from '@/lib/db';



export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, rating, notes, photos } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Student/Application ID is required' }, { status: 400 });
    }

    const student = await updateStudentPortfolioAndGrading(id, {
      rating: rating !== undefined ? Number(rating) : undefined,
      notes,
      photos
    });

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error('Failed to update student portfolio:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
