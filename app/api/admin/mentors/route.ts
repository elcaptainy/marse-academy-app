import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { createMentor, updateMentor, deleteMentor, reorderMentors } from '@/lib/db';

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, role, image, bio, video, socials } = body;

    const mentor = await createMentor({
      name,
      role,
      image,
      bio,
      video,
      socials
    });

    return NextResponse.json({ success: true, data: mentor });
  } catch (error) {
    console.error('Failed to create mentor:', error);
    return NextResponse.json({ success: false, error: 'Database creation failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (Array.isArray(body.orderedIds)) {
      const mentors = await reorderMentors(body.orderedIds);
      return NextResponse.json({ success: true, data: mentors });
    }

    const { id, name, role, image, bio, video, socials, order } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Mentor ID required' }, { status: 400 });
    }

    const mentor = await updateMentor(id, { name, role, image, bio, video, socials, order: typeof order === 'number' ? order : undefined });
    return NextResponse.json({ success: true, data: mentor });
  } catch (error) {
    console.error('Failed to update mentor:', error);
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

    if (!id) {
      return NextResponse.json({ success: false, error: 'Mentor ID required' }, { status: 400 });
    }

    await deleteMentor(id);
    return NextResponse.json({ success: true, message: 'Mentor deleted successfully' });
  } catch (error) {
    console.error('Failed to delete mentor:', error);
    return NextResponse.json({ success: false, error: 'Database deletion failed' }, { status: 500 });
  }
}
