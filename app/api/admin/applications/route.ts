import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { updateApplicationStatus, getWhatsAppSettings, sendTwilioWhatsApp } from '@/lib/db';
import { sendStatusUpdateEmail } from '@/lib/mailer';



async function triggerAdmissionWhatsAppAlert(app: any) {
  try {
    const settings = await getWhatsAppSettings();
    if (!settings.autoOnApproval) return;

    const recipientPhone = app.guardianPhone || app.phone;
    const recipientName = app.guardianName || app.fullName;

    if (recipientPhone) {
      const message = `Dear ${recipientName}, congratulations! ${app.fullName}'s application to Marse Talent Academy has been APPROVED. Please finalize enrollment by secure checkout to reserve a seat: https://marse-academy.com/admissions`;
      await sendTwilioWhatsApp(recipientPhone, message);
    }
  } catch (err) {
    console.error('Error sending WhatsApp admission alert:', err);
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Application ID and Status required' }, { status: 400 });
    }

    const application = await updateApplicationStatus(id, status);
    
    // Trigger automated notifications asynchronously in background
    if (application && application.email) {
      sendStatusUpdateEmail(application.email, application.fullName, status).catch(err => 
        console.error('Failed to send status update email:', err)
      );

      if (status === 'APPROVED') {
        triggerAdmissionWhatsAppAlert(application).catch(err =>
          console.error('Failed to trigger WhatsApp admission alert:', err)
        );
      }
    }
    
    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    console.error('Failed to update application status:', error);
    return NextResponse.json({ success: false, error: 'Database update failed' }, { status: 500 });
  }
}
