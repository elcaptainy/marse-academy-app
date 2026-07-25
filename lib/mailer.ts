import nodemailer from 'nodemailer';

// Helper to create SMTP transporter
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Graceful fallback for local development if credentials aren't set
  if (!user || !pass) {
    console.log('⚠️ SMTP credentials not set in environment variables. Email sending will be simulated.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

// Global Sender Header
const SENDER_INFO = '"Marse Talent Academy Support" <marse.academy.support@gmail.com>';

// Luxury HTML Email Wrapper Template
function getLuxuryWrapper(title: string, contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f7f7f7;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #1a1a1a;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          background-color: #f7f7f7;
          padding: 40px 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.015);
        }
        .header {
          background-color: #000000;
          padding: 40px 30px;
          text-align: center;
          border-bottom: 2px solid #D4AF37;
        }
        .logo-text {
          color: #ffffff;
          font-family: 'Georgia', serif;
          font-size: 26px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0;
        }
        .logo-sub {
          color: #D4AF37;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-top: 8px;
        }
        .content {
          padding: 50px 40px;
          line-height: 1.7;
          font-size: 15px;
          color: #2b2b2b;
        }
        .content h1 {
          font-family: 'Georgia', serif;
          font-size: 24px;
          font-weight: normal;
          color: #000000;
          margin-top: 0;
          margin-bottom: 24px;
        }
        .content p {
          margin-top: 0;
          margin-bottom: 20px;
        }
        .btn-container {
          text-align: center;
          margin: 36px 0 16px;
        }
        .btn {
          display: inline-block;
          background-color: #000000;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 36px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: bold;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid #D4AF37;
          transition: background-color 0.2s ease;
        }
        .footer {
          background-color: #fafafa;
          padding: 30px 40px;
          border-top: 1px solid #eaeaea;
          text-align: center;
          font-size: 11px;
          color: #888888;
          letter-spacing: 0.02em;
        }
        .footer a {
          color: #D4AF37;
          text-decoration: none;
        }
        .gold-divider {
          height: 1px;
          background-color: #D4AF37;
          width: 60px;
          margin: 24px auto;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <div class="logo-text">Marse Talent</div>
            <div class="logo-sub">Luxury Style Academy</div>
          </div>
          <div class="content">
            ${contentHtml}
          </div>
          <div class="footer">
            &copy; 2026 Marse Talent Academy. All Rights Reserved.<br />
            Vienna | London | Milan<br />
            <a href="https://marse-academy.com">Visit Website</a> | <a href="mailto:admissions@marse-academy.com">Contact Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 1. Send Application Confirmation to Student
export async function sendApplicationConfirmationEmail(to: string, name: string) {
  const transporter = getTransporter();
  const title = "Application Received";
  const html = getLuxuryWrapper(title, `
    <h1>Welcome to the Collective</h1>
    <p>Dear ${name},</p>
    <p>We are pleased to inform you that we have successfully received your enrollment application to the Marse Talent Academy.</p>
    <p>Our academic board reviews each application with meticulous attention to creative potential, motivation, and leadership traits. We aim to identify candidates who will truly thrive and contribute to our elite community.</p>
    <div class="gold-divider"></div>
    <p><strong>Next Steps:</strong> We will evaluate your profile over the next 3 to 5 business days. Once approved, one of our admissions advisors will contact you to schedule your private video consultation.</p>
    <p>Thank you for taking the first step toward transforming your talent.</p>
    <p>Sincerely,<br/><strong>The Admissions Board</strong></p>
  `);

  if (!transporter) return console.log(`[SIMULATION] Application confirmation email sent to: ${to}`);
  await transporter.sendMail({
    from: SENDER_INFO,
    to,
    subject: "Application Received | Marse Talent Academy",
    html
  });
}

// 2. Send New Applicant Alert to Admin
export async function sendApplicationAdminAlertEmail(studentName: string, studentEmail: string) {
  const transporter = getTransporter();
  const to = process.env.ADMIN_EMAIL || 'admin@marse-academy.com';
  const html = getLuxuryWrapper("New Applicant Alert", `
    <h1>New Enrollment Application</h1>
    <p>Hello Admin,</p>
    <p>A new application has been submitted on the Marse Talent Academy website.</p>
    <div class="gold-divider"></div>
    <p><strong>Applicant Name:</strong> ${studentName}</p>
    <p><strong>Applicant Email:</strong> ${studentEmail}</p>
    <p>Please log in to your dashboard to review this application, inspect their interests, and update their status.</p>
    <div class="btn-container">
      <a href="https://marse-academy.com/admin" class="btn">View Dashboard</a>
    </div>
  `);

  if (!transporter) return console.log(`[SIMULATION] Admin alert email sent for applicant: ${studentEmail}`);
  await transporter.sendMail({
    from: SENDER_INFO,
    to,
    subject: `New Application Submitted: ${studentName}`,
    html
  });
}

// 3. Send Status Update Email to Student
export async function sendStatusUpdateEmail(to: string, name: string, newStatus: string) {
  const transporter = getTransporter();
  let headline = "Application Status Update";
  let bodyText = "";

  if (newStatus === "APPROVED") {
    headline = "Congratulations | Application Approved";
    bodyText = `
      <p>Dear ${name},</p>
      <p>We are delighted to inform you that your application to Marse Talent Academy has been formally **Approved**.</p>
      <p>You have been identified as a candidate of exceptional potential who embodies the creative drive and ambition we look for in our elite cohort.</p>
      <div class="gold-divider"></div>
      <p><strong>Next Step:</strong> Please schedule your admission call or complete your fee payment to finalize your enrollment and lock in your class seat.</p>
      <div class="btn-container">
        <a href="https://marse-academy.com/admissions" class="btn">Secure Your Seat</a>
      </div>
    `;
  } else if (newStatus === "CONTACTED") {
    headline = "Admission Consultation Update";
    bodyText = `
      <p>Dear ${name},</p>
      <p>Our admissions team has reviewed your application and would love to connect with you for a brief video consultation.</p>
      <p>This conversation will allow us to learn more about your career goals and discuss how our curriculum aligns with your aspirations.</p>
      <div class="gold-divider"></div>
      <p>Please check your phone or inbox shortly. We will reach out to schedule a convenient time.</p>
    `;
  } else if (newStatus === "WAITING_LIST") {
    headline = "Admissions | Priority Waiting List";
    bodyText = `
      <p>Dear ${name},</p>
      <p>Thank you for your interest in joining the Marse Talent Academy.</p>
      <p>Due to extremely high demand and limited cohort sizes, our current class intake has reached its maximum seat capacity.</p>
      <p>Because your profile matches our high standards of creative leadership, we have placed you on our **Priority Waiting List**.</p>
      <div class="gold-divider"></div>
      <p><strong>Next Steps:</strong> We monitor seat availability daily. Should a seat open up or when our next cohort admissions cycle commences, waiting list candidates will be given absolute priority. An admissions officer will contact you immediately when a spot becomes available.</p>
      <p>Thank you for your patience and your dedication to excellence.</p>
    `;
  } else {
    headline = "Application Status Updated";
    bodyText = `
      <p>Dear ${name},</p>
      <p>Your application status has been updated to: <strong>${newStatus}</strong>.</p>
      <p>Please log in or contact our support team at admissions@marse-academy.com if you have any questions.</p>
    `;
  }

  const html = getLuxuryWrapper(headline, bodyText);

  if (!transporter) return console.log(`[SIMULATION] Status update email (${newStatus}) sent to: ${to}`);
  await transporter.sendMail({
    from: SENDER_INFO,
    to,
    subject: `Marse Talent Academy - ${headline}`,
    html
  });
}

// 4. Send Payment Receipt to Student
export async function sendPaymentReceiptEmail(to: string, name: string, planName: string, amount: string, txId: string) {
  const transporter = getTransporter();
  const html = getLuxuryWrapper("Subscription Confirmation", `
    <h1>Subscription Confirmed</h1>
    <p>Dear ${name},</p>
    <p>Thank you for choosing Marse Talent Academy. We have successfully processed your payment and confirmed your enrollment.</p>
    <div class="gold-divider"></div>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #888;">Selected Plan</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; text-align: right; font-weight: bold;">${planName}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #888;">Amount Paid</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; text-align: right; font-weight: bold; color: #D4AF37;">${amount}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; color: #888;">Transaction ID</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; text-align: right; font-family: monospace; font-size: 12px;">${txId}</td>
      </tr>
    </table>
    <p>A coordinator will contact you shortly with onboarding details, school schedule, and access keys to the curriculum platform.</p>
    <p>Welcome to a new standard of creative leadership.</p>
  `);

  if (!transporter) return console.log(`[SIMULATION] Payment receipt email sent to: ${to}`);
  await transporter.sendMail({
    from: SENDER_INFO,
    to,
    subject: "Enrollment Payment Confirmed | Marse Talent",
    html
  });
}

// 5. Send Payment Alert to Admin
export async function sendPaymentAdminAlertEmail(buyerName: string, buyerEmail: string, planName: string, amount: string) {
  const transporter = getTransporter();
  const to = process.env.ADMIN_EMAIL || 'admin@marse-academy.com';
  const html = getLuxuryWrapper("New Sale Alert", `
    <h1>New Enrollment Subscription</h1>
    <p>Hello Admin,</p>
    <p>A new payment has been successfully captured on the Marse Talent Academy website.</p>
    <div class="gold-divider"></div>
    <p><strong>Customer Name:</strong> ${buyerName}</p>
    <p><strong>Customer Email:</strong> ${buyerEmail}</p>
    <p><strong>Subscribed Plan:</strong> ${planName}</p>
    <p><strong>Revenue Captured:</strong> ${amount}</p>
    <div class="btn-container">
      <a href="https://marse-academy.com/admin" class="btn">Review Dashboard</a>
    </div>
  `);

  if (!transporter) return console.log(`[SIMULATION] Admin payment alert email sent for: ${buyerEmail}`);
  await transporter.sendMail({
    from: SENDER_INFO,
    to,
    subject: `New Payment Captured: ${amount} from ${buyerName}`,
    html
  });
}

// 6. Send Password Reset Link to Admin
export async function sendResetPasswordEmail(to: string, resetLink: string) {
  const transporter = getTransporter();
  const html = getLuxuryWrapper("Password Recovery", `
    <h1>Account Access Recovery</h1>
    <p>Hello Admin,</p>
    <p>A password reset request was initiated for your Marse Talent Academy dashboard account.</p>
    <p>If you did not make this request, you can safely ignore this email. Otherwise, click the button below to set a new password. This link is only valid for 1 hour.</p>
    <div class="btn-container">
      <a href="${resetLink}" class="btn">Reset Password</a>
    </div>
    <div class="gold-divider"></div>
    <p style="font-size: 12px; color: #888888;">If the button above does not work, copy and paste this link in your browser:<br/>${resetLink}</p>
  `);

  if (!transporter) return console.log(`[SIMULATION] Password recovery email sent to: ${to}. Link: ${resetLink}`);
  await transporter.sendMail({
    from: SENDER_INFO,
    to,
    subject: "Reset Password | Marse Talent Dashboard",
    html
  });
}

// 7. General Custom Marketing Campaign Email (Elcaptain Email System)
export async function sendCampaignEmail(
  to: string, 
  subject: string, 
  headerTitle: string, 
  bodyText: string, 
  ctaLabel?: string, 
  ctaUrl?: string,
  headerImage?: string
) {
  const transporter = getTransporter();
  
  // Build dynamic content with customizable CTA
  let ctaHtml = '';
  if (ctaLabel && ctaUrl) {
    ctaHtml = `
      <div class="btn-container">
        <a href="${ctaUrl}" class="btn">${ctaLabel}</a>
      </div>
    `;
  }

  // Add custom header image if provided
  let imageHtml = '';
  if (headerImage) {
    imageHtml = `
      <img src="${headerImage}" alt="Promo Banner" style="width: 100%; max-height: 260px; object-fit: cover; border-radius: 8px; margin-bottom: 24px; display: block;" />
    `;
  }

  const contentHtml = `
    ${imageHtml}
    <h1>${headerTitle}</h1>
    <p>${bodyText.replace(/\n/g, '<br />')}</p>
    ${ctaHtml}
  `;

  const html = getLuxuryWrapper(headerTitle, contentHtml);

  if (!transporter) {
    // Log simulation to verify payload mapping
    console.log(`[SIMULATION] Campaign Email Sent to: ${to} | Subject: ${subject}`);
    return;
  }

  await transporter.sendMail({
    from: SENDER_INFO,
    to,
    subject,
    html
  });
}
