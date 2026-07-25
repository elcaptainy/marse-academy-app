import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { updateCurriculumFeature, createCurriculumFeature, deleteCurriculumFeature } from '@/lib/db';



export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { title, videoUrl } = body;
    const feature = await createCurriculumFeature({ title: title || 'New Feature', videoUrl: videoUrl || '' });
    return NextResponse.json({ success: true, data: feature });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create feature' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, title, videoUrl, order } = body;
    if (!id) return NextResponse.json({ success: false, error: 'Feature ID required' }, { status: 400 });
    const feature = await updateCurriculumFeature(id, { title, videoUrl, order: typeof order === 'number' ? order : undefined });
    return NextResponse.json({ success: true, data: feature });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database update failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Feature ID required' }, { status: 400 });
    await deleteCurriculumFeature(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete feature' }, { status: 500 });
  }
}
