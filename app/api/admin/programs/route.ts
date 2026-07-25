import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { createProgram, updateProgram, deleteProgram, reorderPrograms } from '@/lib/db';

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { title, desc, img } = body;
    const item = await createProgram({
      title: title || 'New Program',
      desc: desc || '',
      img: img || ''
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create program' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (Array.isArray(body.orderedIds)) {
      const items = await reorderPrograms(body.orderedIds);
      return NextResponse.json({ success: true, data: items });
    }
    const { id, title, desc, img, order } = body;
    if (!id) return NextResponse.json({ success: false, error: 'Program ID required' }, { status: 400 });
    const item = await updateProgram(id, {
      title,
      desc,
      img,
      order: typeof order === 'number' ? order : undefined
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Program ID required' }, { status: 400 });
    await deleteProgram(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete program' }, { status: 500 });
  }
}
