'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Presentation.module.css';

export default function Presentation({ initialData }: { initialData?: any }) {
  const [aboutSettings, setAboutSettings] = useState(initialData || {
    heroTitle: 'A NEW GENERATION OF CREATIVES',
    heroLead: 'Marse Academy of Fashion & Arts is an international school dedicated to developing the next generation of creative leaders in fashion, art, performance and design.',
    missionImage: '/about-models.png'
  });

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setAboutSettings(data);
        }
      })
      .catch(err => console.error('Failed to load presentation about settings:', err));
  }, []);

  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Photographic image of three models */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.imageCol}
          >
            <div className={styles.imageWrapper}>
              <img src={aboutSettings.missionImage || '/about-models.png'} alt="A New Generation of Creatives" className={styles.image} />
            </div>
          </motion.div>

          {/* Right Column: About Us Copy */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.textCol}
          >
            <div className={styles.subtitleWrapper}>
              <span className={styles.subtitle}>ABOUT US</span>
              <div className={styles.subtitleLine}></div>
            </div>
            
            <h2 className={styles.title}>
              {aboutSettings.heroTitle}
            </h2>
            
            <p className={styles.paragraph}>
              {aboutSettings.heroLead}
            </p>

            <a href="/about" className={styles.learnMoreBtn}>
              LEARN MORE
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
