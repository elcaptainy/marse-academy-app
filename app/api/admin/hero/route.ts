import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { updateHeroSettings } from '@/lib/db';

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, videoUrl, imageUrl, mediaType, mediaPosition, mediaPositionX, mediaPositionY, mediaScale, mediaOverlay } = body;

    const settings = await updateHeroSettings({ 
      title, 
      description, 
      videoUrl, 
      imageUrl,
      mediaType,
      mediaPosition, 
      mediaPositionX, 
      mediaPositionY,
      mediaScale: typeof mediaScale === 'number' ? mediaScale : undefined,
      mediaOverlay: typeof mediaOverlay === 'number' ? mediaOverlay : undefined
    });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Failed to update hero settings:', error);
    return NextResponse.json({ success: false, error: 'Database update failed' }, { status: 500 });
  }
}
