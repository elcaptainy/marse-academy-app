'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CoreSubjects.module.css';

const SUBJECTS = [
  {
    id: 'public-speaking',
    title: 'Public Speaking',
    icon: 'record_voice_over',
    desc: 'Master the art of rhetoric, vocal control, body language, and presence to command any stage and inspire audiences globally.'
  },
  {
    id: 'acting',
    title: 'Acting & Screenplay',
    icon: 'theater_comedy',
    desc: 'Delve into emotional expression, character analysis, and advanced screen acting techniques to bring complex stories to life.'
  },
  {
    id: 'fashion',
    title: 'Fashion Design & Styling',
    icon: 'checkroom',
    desc: 'Unleash your sartorial vision. Learn fabric curation, sketching, garment composition, and styling for editorial shoots.'
  },
  {
    id: 'photography',
    title: 'Editorial Photography',
    icon: 'photo_camera',
    desc: 'High-fashion and portrait studio mastery. Capture premium lighting setup, camera control, and artistic visual storytelling.'
  },
  {
    id: 'cinematography',
    title: 'Cinematography & Film',
    icon: 'movie_creation',
    desc: 'Direct the visual narrative. Master camera choreography, scene lighting, lenses, and visual framing mechanics.'
  },
  {
    id: 'art-direction',
    title: 'Art Direction',
    icon: 'palette',
    desc: 'Guide the aesthetic core of luxury brands, high-end magazines, visual campaigns, and theatrical set concepts.'
  },
  {
    id: 'modeling',
    title: 'Modeling & Runway',
    icon: 'accessibility_new',
    desc: 'Build professional runway walk poise, body language, print modeling angles, and agency portfolio management.'
  },
  {
    id: 'media',
    title: 'Media & Digital Branding',
    icon: 'settings_input_antenna',
    desc: 'Craft a powerful personal brand. Navigate digital storytelling, podcasting, interview techniques, and modern media dynamics.'
  },
  {
    id: 'post-production',
    title: 'Editing & Post-Production',
    icon: 'video_camera_back',
    desc: 'Piece together cinematic art. Master storytelling through advanced video editing, soundscapes, and color grading.'
  },
  {
    id: 'luxury-marketing',
    title: 'Luxury Marketing & Business',
    icon: 'payments',
    desc: 'Understand the business behind premium brands, value positioning, target audiences, and creative entrepreneurship.'
  },
  {
    id: 'creative-writing',
    title: 'Creative Writing & Drama',
    icon: 'edit_note',
    desc: 'Learn character arcs, plot development, screenplay formatting, and script-writing for film and theatrical plays.'
  },
  {
    id: 'digital-arts',
    title: 'Digital Arts & CGI Design',
    icon: 'devices',
    desc: 'Enter the future of art. Learn 3D modeling, virtual fashion simulation, CGI concept art, and digital content innovation.'
  },
  {
    id: 'personal-branding',
    title: 'Influence & Global Presence',
    icon: 'star',
    desc: 'Develop high-end networking etiquette, executive styling, emotional intelligence, and global professional confidence.'
  }
];

export default function CoreSubjects({ initialData }: { initialData?: any[] }) {
  const [activeId, setActiveId] = useState(initialData && initialData.length > 0 ? initialData[0].id : 'public-speaking');
  const [subjects, setSubjects] = useState<any[]>(initialData || SUBJECTS);

  useEffect(() => {
    fetch('/api/subjects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSubjects(data);
          if (!data.some(s => s.id === activeId)) {
            setActiveId(data[0].id);
          }
        }
      })
      .catch(err => console.error('Failed to load subjects:', err));
  }, [activeId]);

  const activeIdx = subjects.findIndex(s => s.id === activeId);
  const activeSubject = subjects[activeIdx] || subjects[0] || SUBJECTS[0];

  return (
    <section id="subjects" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <p className={styles.subtitle}>Curriculum Core</p>
          <h2 className={styles.title}>{subjects.length} Core Pillars</h2>
          <p className={styles.description}>
            Our curriculum is built on {subjects.length} pillars designed to nurture confidence, visual intelligence, and creative mastery. Select a subject below to explore details.
          </p>
        </div>

        {/* Dynamic Display Grid */}
        <div className={styles.grid}>
          {/* Left Column: Visual Details Card */}
          <div className={styles.cardContainer}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSubject.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={styles.editorialCard}
              >
                {/* Gold Abstract Background Accent */}
                <div className={styles.cardAccent}></div>

                {/* Serial Number overlay */}
                <div className={styles.cardSerialNumber}>
                  {String((activeIdx >= 0 ? activeIdx : 0) + 1).padStart(2, '0')}
                </div>

                <div className={styles.cardContent}>
                  {/* Card Header Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 10 }}>
                    <div className={styles.iconContainer}>
                      <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#0A0A0A' }}>
                        {activeSubject.icon}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '9px', letterSpacing: '2px', color: '#8E8A83', fontWeight: 'bold', textTransform: 'uppercase' }}>ACADEMIC MODULE</span>
                      <h3 className={styles.cardTitle}>{activeSubject.title}</h3>
                    </div>
                  </div>

                  {/* Description Copy */}
                  <p className={styles.cardDesc}>{activeSubject.desc}</p>
                </div>

                {/* Visual Graphic Representation */}
                <div className={styles.editorialGraphic}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.2) 100%)', zIndex: 2 }}></div>
                  <div className={styles.graphicOverlayText}>
                    <span>MARSE ACADEMY OF FASHION & ARTS</span>
                    <strong>{activeSubject.title.toUpperCase()}</strong>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Compact Pillars Grid */}
          <div className={styles.pillarsGrid}>
            {subjects.map((subject, index) => {
              const isActive = activeId === subject.id;
              return (
                <motion.div
                  key={subject.id}
                  onClick={() => setActiveId(subject.id)}
                  className={`${styles.pillarCell} ${isActive ? styles.pillarCellActive : ''}`}
                  whileHover={{ scale: 1.01, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.cellNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className={styles.cellContent}>
                    <span className={styles.cellTitle}>{subject.title}</span>
                    <span className={`material-symbols-outlined ${styles.cellIcon}`}>
                      {subject.icon}
                    </span>
                  </div>
                  {/* Active background indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="activePillarBg" 
                      className={styles.activePillarBg}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
