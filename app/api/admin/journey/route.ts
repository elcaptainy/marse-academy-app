import { NextResponse } from 'next/server';
import { updateJourneyStep, reorderJourneySteps } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (Array.isArray(body.orderedIds)) {
      const steps = await reorderJourneySteps(body.orderedIds);
      return NextResponse.json({ success: true, data: steps });
    }
    const updated = await updateJourneyStep(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
