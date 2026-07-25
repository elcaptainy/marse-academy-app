'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './teachers.module.css';

interface Mentor {
  id: string;
  name: string;
  role: string;
  subjectTaught?: string;
  image: string;
  bio: string;
  experienceCredits?: string;
  video?: string;
  hidden?: boolean;
  order?: number;
  socials?: {
    instagram?: string;
    linkedin?: string;
    behance?: string;
    website?: string;
  };
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mentors')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter out hidden teachers for public display
          const visibleTeachers = data.filter((t: Mentor) => !t.hidden);
          setTeachers(visibleTeachers);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load mentors:', err);
        setLoading(false);
      });
  }, []);

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
              <span className={styles.subtitle}>ACADEMY FACULTY & MASTERS</span>
              <div className={styles.subtitleLine}></div>
            </div>
            <h1 className={styles.heroTitle}>MEET OUR INDUSTRY TEACHERS</h1>
            <p className={styles.heroLead}>
              Learn directly from active fashion photographers, international agency directors, luxury stylists, and screen directors bringing real-world experience and credits to every class.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className={styles.teachersSection}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <div className={styles.spinner}></div>
              <p>Loading faculty profiles...</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {teachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={styles.card}
                >
                  <div className={styles.imageWrapper}>
                    <img src={teacher.image || '/hero-model.png'} alt={teacher.name} className={styles.image} />
                    {teacher.subjectTaught && (
                      <span className={styles.subjectBadge}>
                        {teacher.subjectTaught}
                      </span>
                    )}
                  </div>

                  <div className={styles.info}>
                    <h2 className={styles.name}>{teacher.name}</h2>
                    <span className={styles.role}>{teacher.role}</span>
                    
                    {teacher.subjectTaught && (
                      <div className={styles.subjectRow}>
                        <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#C7A56A' }}>school</span>
                        <span><strong>Subject Taught:</strong> {teacher.subjectTaught}</span>
                      </div>
                    )}

                    <p className={styles.bio}>{teacher.bio}</p>

                    {teacher.experienceCredits && (
                      <div className={styles.creditsBox}>
                        <span className={styles.creditsTitle}>EXPERIENCE & CREDITS:</span>
                        <p className={styles.creditsText}>{teacher.experienceCredits}</p>
                      </div>
                    )}
                    
                    {teacher.socials && (
                      <div className={styles.socials}>
                        {teacher.socials.instagram && teacher.socials.instagram !== '#' && (
                          <a href={teacher.socials.instagram} target="_blank" rel="noopener noreferrer">
                            Instagram
                          </a>
                        )}
                        {teacher.socials.linkedin && teacher.socials.linkedin !== '#' && (
                          <a href={teacher.socials.linkedin} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                          </a>
                        )}
                        {teacher.socials.behance && teacher.socials.behance !== '#' && (
                          <a href={teacher.socials.behance} target="_blank" rel="noopener noreferrer">
                            Behance
                          </a>
                        )}
                        {teacher.socials.website && teacher.socials.website !== '#' && (
                          <a href={teacher.socials.website} target="_blank" rel="noopener noreferrer">
                            Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
