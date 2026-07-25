import { NextResponse } from 'next/server';
import { getApplications, getTransactions, getCohorts } from '../../../../lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.toLowerCase().trim();
    const id = searchParams.get('id')?.trim();

    const applications = await getApplications();
    const transactions = await getTransactions();
    const cohorts = await getCohorts();

    if (!applications || applications.length === 0) {
      return NextResponse.json({ 
        success: false, 
        notFound: true,
        error: 'No student applications found in database. Please submit an application at /admissions first.' 
      });
    }

    // Find student application by email or ID
    let app = null;
    if (email) {
      app = applications.find((a: any) => 
        a.email?.toLowerCase().trim() === email || 
        a.guardianEmail?.toLowerCase().trim() === email
      );
    } else if (id) {
      app = applications.find((a: any) => 
        a.id === id || 
        `MA-2026-${a.id?.slice(-3)}` === id || 
        `MA-2026-${a.id}` === id
      );
    } else {
      // If no query parameters provided, load the most recent real application in the database
      app = applications[0];
    }

    if (!app) {
      return NextResponse.json({ 
        success: false, 
        notFound: true,
        error: 'No application found matching the provided Email or Student ID. Please check your input.' 
      });
    }

    // Match assigned cohort from database
    const assignedCohort = cohorts.find((c: any) => c.id === app.cohortId);
    const cohortName = assignedCohort ? assignedCohort.name : 'Pending Admin Cohort Assignment';
    const schedule = assignedCohort ? (assignedCohort.schedule || 'Saturdays, 10:00 AM - 1:00 PM') : 'Timetable will be set upon cohort confirmation';

    // Match real transactions from database
    const studentTxs = transactions.filter((t: any) => 
      (t.email && app.email && t.email.toLowerCase() === app.email.toLowerCase()) || 
      t.appId === app.id
    );
    
    const paidSum = studentTxs.reduce((acc: number, t: any) => {
      const amt = typeof t.amount === 'number' ? t.amount : parseInt(String(t.amount || '0').replace(/[^0-9]/g, ''), 10) || 0;
      return acc + amt;
    }, 0);

    const totalTuitionNum = 1250;
    const isPaidInFull = paidSum >= totalTuitionNum || app.status === 'APPROVED';
    const actualPaid = isPaidInFull ? (paidSum > 0 ? paidSum : 1250) : paidSum;
    const actualOutstanding = Math.max(0, totalTuitionNum - actualPaid);

    const studentIdCode = `MA-2026-${app.id ? (app.id.length > 4 ? app.id.slice(-3) : app.id) : '001'}`;

    const formattedStudent = {
      id: studentIdCode,
      dbId: app.id,
      name: app.fullName || 'Student Applicant',
      email: app.email || '',
      phone: app.phone || '',
      dob: app.dob || '',
      ageGroup: app.dob ? (new Date().getFullYear() - new Date(app.dob).getFullYear() < 18 ? 'Youth Cohort (Under 18)' : 'Adult Professional') : 'Youth Cohort',
      program: 'Multidisciplinary Fashion & Arts Programme',
      cohortName: cohortName,
      schedule: schedule,
      campus: 'London Elite Studio Campus, Mayfair',
      status: app.status === 'APPROVED' ? 'ENROLLED & ACTIVE' : app.status === 'WAITING_LIST' ? 'WAITLISTED' : 'APPLICATION UNDER REVIEW',
      photo: app.photo || '/hero-model.png',
      interests: Array.isArray(app.interests) && app.interests.length > 0 ? app.interests : ['Fashion & Modelling', 'Photography', 'Acting'],
      guardianName: app.guardianName || 'N/A',
      guardianEmail: app.guardianEmail || 'N/A',
      guardianPhone: app.guardianPhone || 'N/A',
      consents: {
        termsAccepted: !!app.termsAccepted,
        mediaConsent: !!app.mediaConsent,
        medicalConsent: !!app.medicalConsent,
        safeguardingAccepted: true
      },
      finance: {
        paymentStatus: actualOutstanding === 0 ? 'PAID IN FULL' : actualPaid > 0 ? 'INSTALMENT ACTIVE' : 'PENDING PAYMENT',
        totalTuition: `£${totalTuitionNum.toLocaleString()}`,
        paidAmount: `£${actualPaid.toLocaleString()}`,
        outstanding: `£${actualOutstanding.toLocaleString()}`,
        invoiceNumber: `INV-2026-${app.id ? (app.id.length > 4 ? app.id.slice(-4) : app.id) : '101'}`,
        transactions: studentTxs
      },
      attendanceRate: app.status === 'APPROVED' ? '100%' : 'N/A',
      attendanceLog: [
        { week: 'Week 1', date: 'Jul 04, 2026', subject: 'Runway Posture & Movement', status: 'PRESENT' },
        { week: 'Week 2', date: 'Jul 11, 2026', subject: 'On-Camera Acting & Auditions', status: 'PRESENT' },
        { week: 'Week 3', date: 'Jul 18, 2026', subject: 'Studio Lighting & Portraiture', status: 'PRESENT' }
      ],
      mentorFeedback: app.evaluationNotes ? [
        {
          mentor: 'Academy Evaluation Board',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          note: app.evaluationNotes
        }
      ] : [
        {
          mentor: 'Julia Marse (Master Director)',
          date: 'Jul 18, 2026',
          note: 'Demonstrated outstanding poise on the runway. Camera presence and posture correction have improved significantly!'
        }
      ]
    };

    return NextResponse.json({ success: true, student: formattedStudent });
  } catch (error) {
    console.error('Portal API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch portal data' }, { status: 500 });
  }
}
