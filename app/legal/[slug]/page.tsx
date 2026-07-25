import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from '../legal.module.css';

const LEGAL_CONTENT: Record<string, { title: string; content: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    content: [
      'MARSE Academy of Fashion & Arts ("we", "us", or "our") is committed to protecting and respecting the privacy of our students, parents, and website visitors. This privacy policy explains how we collect, store, and process personal data.',
      'We collect personal details such as student name, date of birth, medical details, and contact credentials of parents/guardians during the application process. This information is solely used to process registrations, manage class cohorts, coordinate communication, and guarantee safety.',
      'We do not share your personal credentials with unverified external third parties except where required by law or to process billing instalments securely via Stripe. You have the right to request access to, correction of, or deletion of your personal data at any time by contacting our support team.'
    ]
  },
  terms: {
    title: 'Terms & Conditions',
    content: [
      '1. Acceptance of Agreement: By accessing this website or submitting an enrollment application for MARSE Academy of Fashion & Arts ("the Academy"), you agree to be bound by these Terms and Conditions. If you do not agree to all terms, you must not proceed with registration.',
      '2. Enrollment & Cohort Placement: All applications are subject to admissions review, age cohort verification, and studio seat availability. Acceptance into a cohort is confirmed only upon issuance of an official offer letter and receipt of deposit or full tuition payment.',
      '3. Tuition Payments & Instalment Terms: Tuition fees must be paid according to the selected option (Full Term, Monthly Instalments, or Deposit). For instalment plans processed via Stripe or PayPal, automatic billing occurs monthly. Failed payments must be rectified within 5 working days to avoid temporary suspension of student portal access.',
      '4. Attendance & Punctuality: Students are expected to maintain at least 85% attendance across the 12-week term to qualify for diploma certification and graduation showcase entry. Parents must inform the admissions office at least 24 hours in advance of any planned absence.',
      '5. Intellectual Property & Media Rights: All course materials, brand assets, and creative shoot concepts produced by the Academy remain the intellectual property of MARSE Academy. Students receive a non-exclusive license to use their produced portfolio photos and video reels for personal representation and agency submissions.',
      '6. Health, Safety & Liability: Parents/guardians must disclose any medical conditions, allergies, or special physical requirements during application. The Academy maintains comprehensive public liability insurance, but is not responsible for loss or damage to personal items brought to studio sets.',
      '7. Governing Law & Jurisdiction: These Terms and Conditions shall be governed by and construed in accordance with the Laws of England and Wales. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the Courts of London, United Kingdom.'
    ]
  },
  safeguarding: {
    title: 'Safeguarding Policy',
    content: [
      'The safety and welfare of children and teenagers enrolled at MARSE Academy is our highest priority. We believe that all young people have the right to protection from abuse, neglect, and exploitation.',
      'All academy staff, teachers, and casting managers are required to clear enhanced DBS background checks before working with students. We maintain strict staff-to-student ratios and require parents to authorize drop-off and pick-up.',
      'Our dedicated Safeguarding Officer coordinates all safety policies. Any concerns regarding student welfare or inappropriate behavior must be reported immediately. We enforce a zero-tolerance policy for bullying, disrespect, or harassment.'
    ]
  },
  photography: {
    title: 'Photography & Video Policy',
    content: [
      'MARSE Academy regularly curates photoshoots, runway recordings, and behind-the-scenes reels as part of our practical multidisciplinary curriculum. These images are used for student portfolios, showcases, and official academy promotions.',
      'We require explicit parent/guardian consent during the application process before capturing or publishing any student media. Parents have the right to withdraw or modify this consent at any time.',
      'We implement secure storage and vetting procedures for all media assets. Unauthorized photography or filming by visitors during class sessions is strictly prohibited to ensure a safe environment.'
    ]
  },
  refund: {
    title: 'Cancellation & Refund Policy',
    content: [
      'All tuition deposits (£150) are non-refundable as they secure a guaranteed place in a limited cohort. Full term payments may be canceled and refunded in full up to 14 days before the term starts.',
      'Cancellations made within 14 days of the term start date are subject to a cancellation fee. No refunds or tuition credits are granted after the academic term has commenced, except under verified medical circumstances.',
      'In the rare event that MARSE Academy cancels a session or a program due to unforeseen circumstances, a make-up class will be scheduled, or a proportional refund will be issued.'
    ]
  },
  cookies: {
    title: 'Cookie Policy',
    content: [
      'This website uses cookies to enhance your browsing experience, analyze site traffic, and support secure checkout transactions via Stripe.',
      'Essential cookies are required for core website functionality, such as maintaining login states and processing payment credentials. Analytical cookies help us understand user interaction to optimize speed and accessibility.',
      'You can configure your browser preferences to decline non-essential cookies. However, please note that disabling certain cookies may affect page functionality.'
    ]
  },
  accessibility: {
    title: 'Accessibility Statement',
    content: [
      'MARSE Academy is committed to ensuring digital accessibility for people of all abilities. We continuously work to improve the user experience and apply relevant accessibility standards (WCAG 2.1).',
      'Our layout is built with responsive grids, high-contrast monochrome tones, semantic HTML tags, and keyboard-friendly navigation components.',
      'If you experience any accessibility issues or require documents in alternative formats, please reach out to our team at admissions@marse-academy.com.'
    ]
  },
  complaints: {
    title: 'Complaints Procedure',
    content: [
      'MARSE Academy values open feedback and aims to resolve any parent or student concerns quickly, fairly, and professionally.',
      'Enquiries or minor complaints should initially be discussed with the class teacher or campus manager. If a resolution is not achieved, a formal complaint can be submitted in writing to the admissions office.',
      'We investigate all formal complaints thoroughly and provide a written response outlining our findings and actions within 10 working days.'
    ]
  },
  conduct: {
    title: 'Parent & Student Code of Conduct',
    content: [
      'We expect all students and parents to behave respectfully and professionally while on campus or representing MARSE Academy at external casting sets.',
      'Students must follow staff instructions, respect peer boundaries, avoid disruptive behavior, and follow set safety guidelines. Bullying, discrimination, or verbal abuse will result in immediate termination of enrollment.',
      'Parents are expected to support academy staff, maintain respectful communication, arrive on time for pick-up, and respect our campus chaperone guidelines.'
    ]
  }
};

// Aliases for user-friendly URL paths
LEGAL_CONTENT['cancellation-refund'] = LEGAL_CONTENT.refund;
LEGAL_CONTENT['photography-consent'] = LEGAL_CONTENT.photography;
LEGAL_CONTENT['code-of-conduct'] = LEGAL_CONTENT.conduct;

export async function generateStaticParams() {
  return Object.keys(LEGAL_CONTENT).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegalPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const agreement = LEGAL_CONTENT[slug] || {
    title: 'Document Not Found',
    content: ['The requested legal agreement or policy page could not be located.']
  };

  return (
    <main className={styles.main}>
      <Navbar />
      
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.subtitleWrapper}>
            <span className={styles.subtitle}>OFFICIAL POLICY DOCUMENT</span>
            <div className={styles.subtitleLine}></div>
          </div>
          
          <h1 className={styles.title}>{agreement.title}</h1>
          
          <div className={styles.contentBody}>
            {agreement.content.map((paragraph, index) => (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className={styles.backWrapper}>
            <a href="/" className={styles.backLink}>
              Return to Homepage
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
