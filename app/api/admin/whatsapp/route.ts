import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getWhatsAppSettings, saveWhatsAppSettings, getWhatsAppLogs, sendTwilioWhatsApp } from '@/lib/db';



export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await getWhatsAppSettings();
    const logs = await getWhatsAppLogs();
    return NextResponse.json({ success: true, settings, logs });
  } catch (error) {
    console.error('Failed to fetch WhatsApp configurations:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, twilioSid, twilioToken, twilioNumber, autoOnAbsence, autoOnApproval, to, message } = body;

    // Send a test message manually
    if (action === 'send') {
      if (!to || !message) {
        return NextResponse.json({ success: false, error: 'Recipient and message body are required' }, { status: 400 });
      }
      const result = await sendTwilioWhatsApp(to, message);
      return NextResponse.json(result);
    }

    // Save configurations
    const settings = await saveWhatsAppSettings({
      twilioSid: twilioSid || '',
      twilioToken: twilioToken || '',
      twilioNumber: twilioNumber || '',
      autoOnAbsence: autoOnAbsence === true,
      autoOnApproval: autoOnApproval === true
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Failed to update WhatsApp settings:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
