'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

interface HeroProps {
  initialData?: {
    title: string;
    description: string;
    videoUrl: string;
    imageUrl: string;
    mediaType: string;
    mediaPosition?: string;
    mediaPositionX?: string;
    mediaPositionY?: string;
    mediaScale?: number;
    mediaOverlay?: number;
  };
}

export default function Hero({ initialData }: HeroProps) {
  const [data, setData] = useState(initialData || {
    title: 'BEYOND EDUCATION.\nBEYOND LIMITS.',
    description: 'An exclusive collective designed for ambitious youth who dare to shape the future. The Marse Talent standard.',
    videoUrl: '/vienna-makeup-hair.mp4',
    imageUrl: '/hero-model.png',
    mediaType: 'VIDEO', // 'VIDEO' or 'IMAGE'
    mediaPosition: '50%',
    mediaPositionX: '50%',
    mediaPositionY: '50%',
    mediaScale: 1.0,
    mediaOverlay: 0.4
  });

  useEffect(() => {
    fetch('/api/hero')
      .then(res => res.json())
      .then(resData => {
        if (resData) setData(resData);
      })
      .catch(err => console.error('Failed to fetch hero settings:', err));
  }, []);

  const showVideo = data.mediaType === 'VIDEO' || (!data.mediaType && data.videoUrl && (
    data.videoUrl.endsWith('.mp4') || 
    data.videoUrl.endsWith('.webm')
  ));

  const mediaSrc = showVideo ? (data.videoUrl || '/vienna-makeup-hair.mp4') : (data.imageUrl || '/hero-model.png');

  const objectPositionStyle = data.mediaPositionX && data.mediaPositionY 
    ? `${data.mediaPositionX} ${data.mediaPositionY}` 
    : (data.mediaPosition ? `50% ${data.mediaPosition}` : '50% 50%');

  return (
    <section className={styles.heroSection}>
      {/* Left Column: Premium Typography & Brand Identity */}
      <div className={styles.leftColumn}>
        <div className={styles.stackedLogoBlock}>
          <motion.div 
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.heroLogoWrapper}
          >
            <span className={styles.heroLogoLetter}>M</span>
            <span className={styles.heroLogoDivider}>|</span>
            <span className={styles.heroLogoLetter}>A</span>
          </motion.div>
          
          <motion.div 
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={styles.brandTextGroup}
          >
            <h1 className={styles.heroBrandName}>MARSE</h1>
            <p className={styles.heroBrandSub}>ACADEMY OF</p>
            <p className={styles.heroBrandSub2}>FASHION & ARTS</p>
          </motion.div>

          <motion.p 
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className={styles.tagline}
          >
            SHAPING TALENT. BUILDING CONFIDENCE. CREATING FUTURES.
          </motion.p>
          
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ marginTop: '24px' }}
          >
            <a href="/programme" className={styles.boxedBtn}>
              Discover the Programme
            </a>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Visual Close-up Portrait (Image or Video) */}
      <div className={styles.rightColumn} style={{ overflow: 'hidden' }}>
        <div className={styles.mediaContainer}>
          {showVideo ? (
            <video 
              key={mediaSrc}
              className={styles.mediaAsset}
              src={mediaSrc}
              autoPlay 
              muted 
              loop 
              playsInline
              style={{ 
                objectPosition: objectPositionStyle,
                transform: `scale(${data.mediaScale || 1.0})`,
                transition: 'transform 0.1s ease-out'
              }}
            />
          ) : (
            <img 
              className={styles.mediaAsset} 
              src={mediaSrc} 
              alt="Marse Talent Close-up Portrait" 
              style={{ 
                objectPosition: objectPositionStyle,
                transform: `scale(${data.mediaScale || 1.0})`,
                transition: 'transform 0.1s ease-out'
              }}
            />
          )}
          {/* Adjustable dark contrast overlay behind gradient */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#000000',
              opacity: data.mediaOverlay !== undefined ? data.mediaOverlay : 0.4,
              zIndex: 7,
              pointerEvents: 'none',
              transition: 'opacity 0.2s ease'
            }}
          />
          <div className={styles.mediaOverlay}></div>
        </div>
      </div>
    </section>
  );
}
