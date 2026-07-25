import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { getApplications, createApplication, getCohorts } from '@/lib/db';
import { sendApplicationConfirmationEmail, sendApplicationAdminAlertEmail, sendStatusUpdateEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      fullName, 
      email, 
      phone, 
      dob, 
      educationLevel, 
      interests, 
      guardianName, 
      guardianEmail, 
      guardianPhone,
      photo,
      termsAccepted,
      mediaConsent,
      medicalConsent,
      cohortId
    } = body;

    if (!fullName || !email || !educationLevel) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }

    // Save base64 photo to server public disk if uploaded
    let photoUrl = null;
    if (photo && typeof photo === 'string' && photo.startsWith('data:')) {
      const matches = photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], 'base64');
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        
        const webpFilename = `student-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.webp`;
        const webpFilePath = join(uploadDir, webpFilename);

        // Compress profile image to max 800px width WebP format
        const compressedBuffer = await sharp(buffer)
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        await fs.writeFile(webpFilePath, compressedBuffer);
        photoUrl = `/uploads/${webpFilename}`;
      }
    }

    // Capacity logic check based on the selected class cohort
    const allApplications = await getApplications();
    let initialStatus = 'PENDING';

    if (cohortId) {
      const cohorts = await getCohorts();
      const cohort = cohorts.find((c: any) => c.id === cohortId);
      if (cohort) {
        const enrolledCount = allApplications.filter(
          (app: any) => app.cohortId === cohortId && app.status === 'APPROVED'
        ).length;
        
        if (enrolledCount >= cohort.capacity) {
          initialStatus = 'WAITING_LIST';
        }
      }
    }

    const application = await createApplication({
      fullName,
      email,
      phone,
      dob,
      educationLevel,
      interests,
      guardianName,
      guardianEmail,
      guardianPhone,
      photo: photoUrl,
      termsAccepted: termsAccepted === true,
      mediaConsent: mediaConsent === true,
      medicalConsent: medicalConsent === true,
      cohortId: cohortId || null,
      status: initialStatus
    });
    
    // Trigger automated emails asynchronously in the background
    if (initialStatus === 'WAITING_LIST') {
      sendStatusUpdateEmail(email, fullName, 'WAITING_LIST').catch(err => console.error('Failed to send waiting list email:', err));
    } else {
      sendApplicationConfirmationEmail(email, fullName).catch(err => console.error('Failed to send student confirmation:', err));
    }
    sendApplicationAdminAlertEmail(fullName, email).catch(err => console.error('Failed to send admin alert:', err));
    
    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    console.error('Failed to submit application API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const applications = await getApplications();
  return NextResponse.json(applications);
}
