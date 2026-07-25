'use client';

import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JoinCollective from '../components/JoinCollective';
import styles from './admissions.module.css';

const ADMISSIONS_STEPS = [
  {
    num: '01',
    title: 'COMPLETE APPLICATION',
    desc: 'Fill out the online application form below with student details, interest areas, and medical/photography consents.'
  },
  {
    num: '02',
    title: 'ADMIN REVIEW',
    desc: 'Our admissions board reviews the submission within 3-5 working days to confirm space availability in the requested age cohort.'
  },
  {
    num: '03',
    title: 'INTRODUCTORY MEETING',
    desc: 'We invite the parent and student to a short Zoom meeting or studio tour to align expectations and answer class questions.'
  },
  {
    num: '04',
    title: 'OFFER OF A PLACE',
    desc: 'Successful applicants receive an official offer letter via email specifying their class cohort details and timetable.'
  },
  {
    num: '05',
    title: 'REGISTRATION & DEPOSIT',
    desc: 'Secure the place by making the term payment or setting up the flexible monthly instalment plan online.'
  },
  {
    num: '06',
    title: 'WELCOME DETAILS',
    desc: 'Access your student portal, read our safeguarding code of conduct, and receive your studio welcome handbook.'
  }
];

export default function AdmissionsPage() {
  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Header */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.heroContent}
          >
            <div className={styles.subtitleWrapper}>
              <span className={styles.subtitle}>REGISTRATION WORKFLOW</span>
              <div className={styles.subtitleLine}></div>
            </div>
            <h1 className={styles.heroTitle}>THE ADMISSIONS JOURNEY</h1>
            <p className={styles.heroLead}>
              We make enrollment seamless for parents while maintaining high creative standards. Review our structured admissions timeline and submit your application below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 6 Step Journey Timeline */}
      <section className={styles.journeySection}>
        <div className={styles.container}>
          <div className={styles.journeyGrid}>
            {ADMISSIONS_STEPS.map((s, idx) => (
              <motion.div 
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={styles.journeyCard}
              >
                <span className={styles.stepNum}>{s.num}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className={styles.formSection} id="apply">
        <div className={styles.container}>
          <div className={styles.formHeader}>
            <div className={styles.subtitleWrapper} style={{ alignItems: 'center' }}>
              <span className={styles.subtitle}>APPLICATION FORM</span>
              <div className={styles.subtitleLine}></div>
            </div>
            <h2 className={styles.formTitle}>ADMISSIONS REGISTRATION</h2>
            <p className={styles.formLead}>Please fill out all required student and parent fields. If the student is under 18, parent/guardian authorization is required.</p>
          </div>
          
          <div className={styles.formContainer}>
            <JoinCollective />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
