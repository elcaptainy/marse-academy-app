import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getAttendanceLogs, saveAttendanceLog, getApplications, getWhatsAppSettings, sendTwilioWhatsApp } from '@/lib/db';



async function triggerAbsenceWhatsAppAlerts(records: Record<string, string>, date: string) {
  try {
    const settings = await getWhatsAppSettings();
    if (!settings.autoOnAbsence) return;

    const students = await getApplications();

    for (const [studentId, status] of Object.entries(records)) {
      if (status === 'ABSENT') {
        const student = students.find((s: any) => s.id === studentId);
        if (student) {
          // Send to guardian if exists (for minors), otherwise send to student directly
          const recipientPhone = student.guardianPhone || student.phone;
          const recipientName = student.guardianName || student.fullName;

          if (recipientPhone) {
            const message = `Dear ${recipientName}, please be informed that ${student.fullName} was marked ABSENT from today's Marse Talent session (${date}). If this is an excused absence, please submit a medical/excusal note.`;
            await sendTwilioWhatsApp(recipientPhone, message);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error triggering WhatsApp absence alerts:', err);
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const logs = await getAttendanceLogs();
  return NextResponse.json(logs);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { cohortId, date, records } = body;
    if (!cohortId || !date || !records) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }
    const log = await saveAttendanceLog({
      cohortId,
      date,
      records
    });

    // Trigger WhatsApp alerts asynchronously
    triggerAbsenceWhatsAppAlerts(records, date).catch(err => 
      console.error('Async WhatsApp alerts error:', err)
    );

    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    console.error('Failed to save attendance log:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
