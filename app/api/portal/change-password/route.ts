import { NextResponse } from 'next/server';
import { getApplications, updateApplicationPassword } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { studentId, currentPassword, newPassword } = await request.json();

    if (!studentId || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: 'New password must be at least 6 characters long.' 
      }, { status: 400 });
    }

    const applications = await getApplications();
    const app = applications.find((a: any) => 
      a.id === studentId || 
      `MA-2026-${a.id?.slice(-3)}` === studentId || 
      `MA-2026-${a.id}` === studentId
    );

    if (!app) {
      return NextResponse.json({ 
        success: false, 
        error: 'Student record not found.' 
      }, { status: 404 });
    }

    // Update password in DB
    await updateApplicationPassword(app.id, newPassword);

    return NextResponse.json({ 
      success: true, 
      message: 'Password updated successfully! Please use your new password for future logins.' 
    });
  } catch (error) {
    console.error('Failed to change password:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update password. Server error.' 
    }, { status: 500 });
  }
}
