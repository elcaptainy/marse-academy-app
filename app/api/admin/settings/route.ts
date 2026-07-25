import { NextResponse } from 'next/server';
import { updateGlobalSettings } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = await updateGlobalSettings(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
