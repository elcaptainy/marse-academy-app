import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { createFAQ, updateFAQ, deleteFAQ } from '@/lib/db';



export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { question, answer } = body;

    const faq = await createFAQ({ question, answer });
    return NextResponse.json({ success: true, data: faq });
  } catch (error) {
    console.error('Failed to create FAQ:', error);
    return NextResponse.json({ success: false, error: 'Database creation failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, question, answer } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'FAQ ID required' }, { status: 400 });
    }

    const faq = await updateFAQ(id, { question, answer });
    return NextResponse.json({ success: true, data: faq });
  } catch (error) {
    console.error('Failed to update FAQ:', error);
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
      return NextResponse.json({ success: false, error: 'FAQ ID required' }, { status: 400 });
    }

    await deleteFAQ(id);
    return NextResponse.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Failed to delete FAQ:', error);
    return NextResponse.json({ success: false, error: 'Database deletion failed' }, { status: 500 });
  }
}
