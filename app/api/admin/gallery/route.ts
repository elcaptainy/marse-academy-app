import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { updateBentoGallery, createBentoGallery, deleteBentoGallery } from '@/lib/db';



export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { type, url, size, altText, category } = body;
    const item = await createBentoGallery({
      type: type || 'IMAGE',
      url: url || '',
      size: size || 'SQUARE',
      altText: altText || 'Gallery Item',
      category: category || 'CLASSES'
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create gallery item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, type, url, size, altText, category, order } = body;
    if (!id) return NextResponse.json({ success: false, error: 'Gallery item ID required' }, { status: 400 });
    const item = await updateBentoGallery(id, { type, url, size, altText, category, order: typeof order === 'number' ? order : undefined });
    return NextResponse.json({ success: true, data: item });
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
    if (!id) return NextResponse.json({ success: false, error: 'Gallery item ID required' }, { status: 400 });
    await deleteBentoGallery(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
