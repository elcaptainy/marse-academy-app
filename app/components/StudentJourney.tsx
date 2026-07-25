'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './StudentJourney.module.css';

const JOURNEY_STEPS = [
  {
    step: '01',
    title: 'Admissions & Apply',
    desc: 'Submit your legal details, educational background, and approvals through our secure registration portal.'
  },
  {
    step: '02',
    title: 'Taster Masterclass',
    desc: 'Receive a selective invitation to attend an immersive in-person creative taster session with master mentors.'
  },
  {
    step: '03',
    title: 'Cohort & Tuition Match',
    desc: 'Confirm your class placement and select your billing option (Full, Quarterly, or Subscription).'
  },
  {
    step: '04',
    title: 'Rigorous Academic Training',
    desc: 'Engage in intensive weekly workshops led by global leaders across all creative and communication disciplines.'
  },
  {
    step: '05',
    title: 'Continuous Evaluation',
    desc: 'Gain direct feedback, photoshoots ratings, and structured performance reviews logged in your academic file.'
  },
  {
    step: '06',
    title: 'Graduate Runway Shows',
    desc: 'Co-produce editorial high-fashion photography campaigns, short films, and final graduation runway projects.'
  },
  {
    step: '07',
    title: 'Agency Representation',
    desc: 'Complete your certified digital portfolio, globally verified and presented directly to elite international talent agencies.'
  }
];

export default function StudentJourney({ initialData }: { initialData?: any[] }) {
  const [steps, setSteps] = useState<any[]>(initialData || JOURNEY_STEPS);

  useEffect(() => {
    fetch('/api/journey')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSteps(data);
        }
      })
      .catch(err => console.error('Failed to load journey steps:', err));
  }, []);

  return (
    <section id="journey" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <p className={styles.subtitle}>The Trajectory</p>
          <h2 className={styles.title}>Student Journey</h2>
          <p className={styles.description}>
            From initial selection to global career representation. Explore the structured path of development at Marse Academy.
          </p>
        </div>

        {/* Timeline Path Container */}
        <div className={styles.timeline}>
          {/* Vertical Center Line */}
          <div className={styles.line}></div>

          {/* Steps */}
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div 
                key={step.step}
                className={`${styles.stepWrapper} ${isLeft ? styles.stepLeft : styles.stepRight}`}
              >
                {/* Visual Dot on Timeline Line */}
                <div className={styles.dot}>
                  <span className={styles.dotInner}></span>
                </div>

                {/* Step Card Content */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={styles.card}
                >
                  <span className={styles.stepNum}>{step.step}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
