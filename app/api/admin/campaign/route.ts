import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { sendCampaignEmail } from '@/lib/mailer';



export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { recipients, subject, headerTitle, bodyText, ctaLabel, ctaUrl, headerImage } = body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ success: false, error: 'Recipients list is required' }, { status: 400 });
    }
    if (!subject || !headerTitle || !bodyText) {
      return NextResponse.json({ success: false, error: 'Subject, Header Title, and Body Text are required' }, { status: 400 });
    }

    // Send campaign emails sequentially to avoid rate limits or file-locks
    for (const email of recipients) {
      await sendCampaignEmail(email, subject, headerTitle, bodyText, ctaLabel, ctaUrl, headerImage);
    }

    return NextResponse.json({ success: true, message: `Campaign broadcast completed to ${recipients.length} recipients.` });
  } catch (error) {
    console.error('Failed to broadcast campaign:', error);
    return NextResponse.json({ success: false, error: 'Failed to broadcast campaign' }, { status: 500 });
  }
}
