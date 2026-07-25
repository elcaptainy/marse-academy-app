'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Programs.module.css';

const DEFAULT_PROGRAMS_DATA = [
  {
    id: '1',
    title: 'FASHION & MODELLING',
    desc: 'Master professional runway posture, camera posing angles, and casting confidence.',
    img: '/program-fashion-modeling.png'
  },
  {
    id: '2',
    title: 'ACTING & PERFORMANCE',
    desc: 'Screen acting, emotional expression, improvisation, and vocal projection.',
    img: '/program-performing-arts.png'
  },
  {
    id: '3',
    title: 'FASHION DESIGN & STYLING',
    desc: 'Develop your sartorial aesthetic, garment creation, and editorial styling.',
    img: '/program-fashion-design.png'
  },
  {
    id: '4',
    title: 'PHOTOGRAPHY & CREATIVE DIRECTION',
    desc: 'Studio lighting mechanics, composition, framing, and directing visual shoots.',
    img: '/program-photography.png'
  },
  {
    id: '5',
    title: 'CONFIDENCE & PERSONAL DEVELOPMENT',
    desc: 'Public speaking poise, self-expression, communication, and executive presence.',
    img: '/program-creative-arts.png'
  }
];

export default function Programs({ initialData }: { initialData?: any[] }) {
  const [programs, setPrograms] = useState<any[]>(initialData || []);

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPrograms(data);
        }
      })
      .catch(err => console.error('Failed to load programs list:', err));
  }, []);

  const displayPrograms = programs.length > 0 ? programs : DEFAULT_PROGRAMS_DATA;

  return (
    <section id="programs" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.subtitleWrapper}>
              <span className={styles.subtitle}>PROGRAMS</span>
              <div className={styles.subtitleLine}></div>
            </div>
            <h2 className={styles.title}>UNLOCK YOUR POTENTIAL</h2>
          </div>
          <div className={styles.headerRight}>
            <a href="#subjects" className={styles.viewAllLink}>
              VIEW ALL PROGRAMS
            </a>
          </div>
        </div>

        {/* 5 Column Grid */}
        <div className={styles.grid}>
          {displayPrograms.map((prog, index) => (
            <motion.div
              key={prog.id || prog.title}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <img src={prog.img} alt={prog.title} className={styles.image} />
              </div>
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{prog.title}</h3>
                <p className={styles.cardDesc}>{prog.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
