'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Enrollment from '../components/Enrollment';
import styles from './programme.module.css';

const MODULES = [
  {
    num: '01',
    title: 'Fashion & Modelling',
    tag: 'MODULE I',
    desc: 'Master professional runway walks, body posture correction, camera posing angles, casting call preparation, and high-fashion set etiquette.',
    skills: ['Runway Walks', 'Camera Posing', 'Casting Prep', 'Set Etiquette']
  },
  {
    num: '02',
    title: 'Acting & Performance',
    tag: 'MODULE II',
    desc: 'Develop authentic emotional expression, improvisation skills, vocal projection, script breakdown, and confidence for on-camera screen auditions.',
    skills: ['Improvisation', 'Vocal Projection', 'On-Camera Acting', 'Character Work']
  },
  {
    num: '03',
    title: 'Photography & Lighting',
    tag: 'MODULE III',
    desc: 'Understand studio vs. natural light, visual storytelling, framing rules, portraiture composition, and directing subjects in live shoots.',
    skills: ['Studio Lighting', 'Composition', 'Visual Storytelling', 'Portraiture']
  },
  {
    num: '04',
    title: 'Fashion Design & Styling',
    tag: 'MODULE IV',
    desc: 'Build creative mood boards, explore color palettes and garment textures, master editorial styling techniques, and sustainable design practices.',
    skills: ['Mood Boards', 'Color Theory', 'Editorial Styling', 'Textile Arts']
  },
  {
    num: '05',
    title: 'Creative Direction',
    tag: 'MODULE V',
    desc: 'Transform abstract ideas into visual reality: concept development, visual research, set design, pitch deck presentation, and art directing.',
    skills: ['Concept Building', 'Art Direction', 'Shoot Planning', 'Pitch Skills']
  },
  {
    num: '06',
    title: 'Confidence & Leadership',
    tag: 'MODULE VI',
    desc: 'Enhance public speaking skills, team collaboration, poise under pressure, positive body language, and high-impact personal presentation.',
    skills: ['Public Speaking', 'Teamwork', 'Body Language', 'Self-Poise']
  },
  {
    num: '07',
    title: 'Movement & Body Awareness',
    tag: 'MODULE VII',
    desc: 'Refine spatial awareness, physical coordination, rhythm, stage movement, and fluid posture for high-energy editorial modeling and dance.',
    skills: ['Coordination', 'Posture Control', 'Stage Movement', 'Spatial Sense']
  }
];

const STEPS = [
  { num: '1', title: 'Warm-up & Confidence', text: 'Vocal projection, posture alignment, and icebreaker group exercises.' },
  { num: '2', title: 'Main Masterclass', text: 'Live demonstration by active fashion masters on weekly technique.' },
  { num: '3', title: 'Practical Task', text: 'Small team application and hands-on practice under mentor guidance.' },
  { num: '4', title: 'Industry Project', text: 'Simulated runway show, studio photo session, or on-camera scene.' },
  { num: '5', title: 'Evaluation & Feedback', text: 'Personalized evaluation logged into individual student portfolio.' }
];

export default function ProgrammePage() {
  const [modelingImg, setModelingImg] = useState('/program-fashion-modeling.png');

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const modeling = data.find((p: any) => p.title.toUpperCase().includes('MODELING') || p.title.toUpperCase().includes('MODELLING'));
          if (modeling && modeling.img) {
            setModelingImg(modeling.img);
          } else if (data[0] && data[0].img) {
            setModelingImg(data[0].img);
          }
        }
      })
      .catch(err => console.error('Failed to load programs list:', err));
  }, []);

  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Header */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.heroContent}
          >
            <div className={styles.badgeTag}>
              <span className={styles.badgeDot}></span>
              ACADEMY SPECIFICATIONS & CURRICULUM
            </div>
            
            <h1 className={styles.heroTitle}>
              MARSE ACADEMY <span>PROGRAMME</span>
            </h1>
            
            <p className={styles.heroLead}>
              A comprehensive multidisciplinary training system combining high-fashion runway, acting, photography, and creative design—cultivating elite talent and personal confidence.
            </p>

            {/* Key Stats Bar */}
            <div className={styles.statsBar}>
              <div className={styles.statItem}>
                <span className={styles.statVal}>12 WEEKS</span>
                <span className={styles.statLbl}>Term Duration</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>7 MODULES</span>
                <span className={styles.statLbl}>Core Subjects</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>12 STUDENTS</span>
                <span className={styles.statLbl}>Max Cohort Size</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>ACCREDITED</span>
                <span className={styles.statLbl}>Diploma & Showcase</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 1. Programme Overview & Who It Is For Grid */}
      <section className={styles.overviewSection}>
        <div className={styles.container}>
          <div className={styles.overviewGrid}>
            
            {/* Overview Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={styles.whiteCard}
            >
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Programme Overview</h2>
                <span className={`material-symbols-outlined ${styles.cardIcon}`}>dashboard</span>
              </div>
              
              <ul className={styles.specList}>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>Age Cohorts</span>
                  <span className={styles.specValue}>Children (6-11) & Youth (12-18)</span>
                </li>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>Campuses</span>
                  <span className={styles.specValue}>London Studio & Vienna Campus</span>
                </li>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>Class Timetable</span>
                  <span className={styles.specValue}>Saturdays or Sundays (Weekly)</span>
                </li>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>Session Length</span>
                  <span className={styles.specValue}>3 Hours Active Studio Session</span>
                </li>
                <li className={styles.specItem}>
                  <span className={styles.specLabel}>Key Outcomes</span>
                  <span className={styles.specValue}>Runway Show, Portfolio, Certificate</span>
                </li>
              </ul>
            </motion.div>

            {/* Who It Is For Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={styles.whiteCard}
            >
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle} style={{ color: '#C7A56A' }}>Who It Is For</h2>
                <span className={`material-symbols-outlined ${styles.cardIcon}`}>person_celebration</span>
              </div>
              
              <p className={styles.whoBoxText}>
                Tailored for both <strong>beginners</strong> taking their initial creative steps and <strong>students with prior experience</strong> seeking high-level polish.
              </p>

              <div className={styles.pillGrid}>
                <div className={styles.pillItem}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                  <span>No prior professional background required</span>
                </div>
                <div className={styles.pillItem}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                  <span>Personalized cohort placement by age & skill</span>
                </div>
                <div className={styles.pillItem}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                  <span>Holistic admissions assessment process</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Core Modules Section */}
      <section className={styles.modulesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionSub}>CURRICULUM SPECIFICATIONS</span>
            <h2 className={styles.sectionHeading}>THE 7 CORE MODULES</h2>
          </div>

          <div className={styles.modulesGrid}>
            {MODULES.map((m, idx) => (
              <motion.div 
                key={m.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={styles.moduleCard}
              >
                <div className={styles.moduleHeaderRow}>
                  <span className={styles.moduleNumber}>{m.num}</span>
                  <span className={styles.moduleTag}>{m.tag}</span>
                </div>
                
                <h3 className={styles.moduleTitle}>{m.title}</h3>
                <p className={styles.moduleDesc}>{m.desc}</p>
                
                <div className={styles.skillPills}>
                  {m.skills.map((skill) => (
                    <span key={skill} className={styles.skillPill}>{skill}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Programme Format Section */}
      <section className={styles.formatSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionSub}>STRUCTURED EDUCATION</span>
            <h2 className={styles.sectionHeading}>PROGRAMME FORMAT</h2>
          </div>

          <div className={styles.formatGrid}>
            <div className={styles.formatCard}>
              <span className={`material-symbols-outlined ${styles.formatIcon}`}>calendar_month</span>
              <h3>Timetable & Dates</h3>
              <p>Fixed 12-week schedule with designated holiday breaks and guaranteed weekend timeslots.</p>
            </div>
            
            <div className={styles.formatCard}>
              <span className={`material-symbols-outlined ${styles.formatIcon}`}>groups</span>
              <h3>Max Group Size</h3>
              <p>Strictly capped at 12–15 students per cohort to ensure one-on-one mentor attention.</p>
            </div>
            
            <div className={styles.formatCard}>
              <span className={`material-symbols-outlined ${styles.formatIcon}`}>workspace_premium</span>
              <h3>Final Project</h3>
              <p>Culminates in an accredited runway showcase, agency presentation, and digital portfolio shoot.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Typical Class Structure */}
      <section className={styles.structureSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionSub}>WEEKLY FRAMEWORK</span>
            <h2 className={styles.sectionHeading}>TYPICAL CLASS STRUCTURE</h2>
          </div>

          <div className={styles.stepsTimeline}>
            {STEPS.map((s) => (
              <motion.div 
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: parseInt(s.num) * 0.1 }}
                className={styles.stepCard}
              >
                <div className={styles.stepNumber}>{s.num}</div>
                <h4 className={styles.stepTitle}>{s.title}</h4>
                <p className={styles.stepText}>{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. What Students Receive */}
      <section className={styles.receiveSection}>
        <div className={styles.container}>
          <div className={styles.receiveGrid}>
            <div>
              <span className={styles.sectionSub}>STUDENT INCLUSIONS</span>
              <h2 className={styles.sectionHeading}>WHAT STUDENTS RECEIVE</h2>
              
              <ul className={styles.receiveList}>
                <li className={styles.receiveItem}>
                  <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                  <div className={styles.receiveTextContent}>
                    <strong>Practical Set Experience:</strong> Real studio cameras, runway sets, and professional lighting equipment.
                  </div>
                </li>
                <li className={styles.receiveItem}>
                  <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                  <div className={styles.receiveTextContent}>
                    <strong>Industry Master Teachers:</strong> Direct classes taught by active fashion photographers, directors, and agency mentors.
                  </div>
                </li>
                <li className={styles.receiveItem}>
                  <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                  <div className={styles.receiveTextContent}>
                    <strong>Professional Portfolio Imagery:</strong> High-resolution editorial headshots and fashion portfolio pictures.
                  </div>
                </li>
                <li className={styles.receiveItem}>
                  <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                  <div className={styles.receiveTextContent}>
                    <strong>Certificate & Showcase:</strong> Official Marse Academy Diploma and graduation runway showcase for guests.
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.imageFrame}>
              <img src={modelingImg} alt="Marse Academy students showcase" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Industry Opportunities */}
      <section className={styles.opportunitiesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionSub}>CAREER PATHWAYS</span>
            <h2 className={styles.sectionHeading}>INDUSTRY OPPORTUNITIES</h2>
          </div>

          <div className={styles.oppGrid}>
            <div className={styles.oppCard}>
              <h3>Casting & Agency Prep</h3>
              <p>Direct guidance on model contracts, agency submissions, casting etiquette, and introductions to elite international agencies.</p>
            </div>
            
            <div className={styles.oppCard}>
              <h3>Fashion Week Shows</h3>
              <p>Opportunities to walk in graduate runway events, designer collaboration showcases, and live press presentations.</p>
            </div>
            
            <div className={styles.oppCard}>
              <h3>Editorial Campaigns</h3>
              <p>Features in digital fashion magazine lookbooks, brand campaigns, and commercial photography projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Price & Payment Section */}
      <section id="pricing">
        <Enrollment />
        <div className={styles.container} style={{ marginTop: '-40px', marginBottom: '80px' }}>
          {/* Refund & Inclusions Policy Bar */}
          <div className={styles.policyBar}>
            <strong style={{ color: '#0A0A0A' }}>Inclusions & Terms:</strong> All enrolment options include complete studio facility access, professional photo assets, and showcase entry. Deposits are fully refundable up to 14 days prior to term commencement. Review our <a href="/legal/terms">Terms & Cancellation Policy</a>.
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
