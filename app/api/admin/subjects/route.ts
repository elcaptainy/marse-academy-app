import { NextRequest, NextResponse } from 'next/server';
import { getCoreSubjects, createCoreSubject, updateCoreSubject, deleteCoreSubject, reorderCoreSubjects } from '@/lib/db';
import { isAuthorized } from '@/lib/auth';

export async function GET() {
  try {
    const subjects = await getCoreSubjects();
    return NextResponse.json(subjects);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const created = await createCoreSubject(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (Array.isArray(body.orderedIds)) {
      const reordered = await reorderCoreSubjects(body.orderedIds);
      return NextResponse.json({ success: true, data: reordered });
    }
    const updated = await updateCoreSubject(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Subject ID is required' }, { status: 400 });
    }
    await deleteCoreSubject(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
