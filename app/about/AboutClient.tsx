'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './about.module.css';

interface AboutClientProps {
  initialData?: any;
}

const DEFAULT_ABOUT_SETTINGS = {
  heroTitle: 'A NEW GENERATION OF CREATIVES',
  heroLead: 'MARSE Academy of Fashion & Arts is a premium London-based creative institution. We merge high fashion, visual arts, and performance to build elite skills and personal confidence in young minds.',
  storyTitle: 'OUR STORY',
  storyText1: 'Founded in London, MARSE Academy was born out of a desire to create a safe, aspirational space for young creative minds. Julia Marse recognized that traditional creative education was fragmented; modeling was taught separately from acting, and photography was rarely integrated with creative styling or confidence training.',
  storyText2: 'We built MARSE Academy as a multidisciplinary hub where young people don\'t just learn skills—they collaborate on real production sets, direct photoshoots, curate sustainable fashion collections, and present themselves to the world with power and elegance.',
  storyQuote: 'We do not only train models and actors; we nurture future leaders, creative directors, and confident communicators who dare to shape the cultural landscape.',
  missionTitle: 'OUR MISSION',
  missionText: 'To develop confident, creative, and highly disciplined young people. While we provide elite industry-grade training in fashion and modeling, our ultimate mission is to build character, resilience, and creative leaders. We prepare students for life, giving them communication skills, posture, set etiquette, and teamwork capabilities that serve them in any career.',
  missionImage: '/about-models.png',
  founderName: 'JULIA MARSE',
  founderTitle: 'International Fashion Photographer, Creative Director & Educator',
  founderBio1: 'Julia Marse is an acclaimed international fashion photographer, creative director, studio owner, and passionate educator. With over a decade of experience shooting for luxury brands and fashion magazines, Julia founded MARSE Academy to pass down set etiquette, photography techniques, and styling workflows to the next generation.',
  founderBio2: 'Under her creative direction, students get the unique opportunity to shoot on high-end production sets, build premium portfolios, and learn directly from active industry experts.',
  founderImage: '/hero-model.png',
  founderSignature: 'Julia Marse',
  safeguardingTitle: 'SAFEGUARDING CULTURE',
  safeguardingText: 'Student welfare is our absolute priority. MARSE Academy is committed to providing a safe, supportive, and respectful environment. All staff are fully vetted (DBS cleared), and we implement strict media consent protocols, transparent chaperone policies, and strict codes of conduct to ensure complete safety and peace of mind for parents.'
};

export default function AboutClient({ initialData }: AboutClientProps) {
  const [settings, setSettings] = useState<any>(initialData || null);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(err => {
        console.error('Failed to fetch about settings:', err);
      });
  }, []);

  const content = settings || DEFAULT_ABOUT_SETTINGS;

  return (
    <main className={styles.main}>
      <Navbar />
      
      {/* Editorial Hero Header */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.heroContent}
            >
              <div className={styles.subtitleWrapper}>
                <span className={styles.subtitle}>WHO WE ARE</span>
                <div className={styles.subtitleLine}></div>
              </div>
              <h1 className={styles.heroTitle}>{content.heroTitle}</h1>
              <p className={styles.heroLead}>{content.heroLead}</p>
              
              <a href="/admissions" className={styles.heroBtn}>
                Explore Admissions
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={styles.heroImageContainer}
            >
              <div className={styles.imageFrameBack}>
                <img src={content.heroImageBack || content.missionImage || '/about-models.png'} alt="Marse Academy models back" />
              </div>
              <div className={styles.imageFrameFront}>
                <img src={content.heroImageFront || content.founderImage || '/hero-model.png'} alt="Marse Academy models front" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story & Mission Split Grid */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={styles.storyCol}
            >
              <h2 className={styles.sectionHeading}>{content.storyTitle}</h2>
              <p className={styles.paragraph}>
                <span className={styles.dropCap}>F</span>
                {content.storyText1 ? content.storyText1.slice(1) : ''}
              </p>
              <p className={styles.paragraph}>{content.storyText2}</p>
              
              {content.storyQuote && (
                <div className={styles.quoteBlock}>
                  <span className={styles.quoteMark}>“</span>
                  <p className={styles.quoteText}>{content.storyQuote}</p>
                  <span className={styles.quoteMarkRight}>”</span>
                </div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={styles.storyCol}
            >
              <div className={styles.missionCard}>
                <h2 className={styles.missionHeading}>{content.missionTitle}</h2>
                <p className={styles.missionParagraph}>{content.missionText}</p>
                
                {content.missionImage && (
                  <div className={styles.missionImageWrapper}>
                    <img 
                      src={content.missionImage} 
                      alt="MARSE Production Set" 
                    />
                    <div className={styles.missionImageBorder}></div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Spotlight - Vogue Style */}
      <section className={styles.founderSection}>
        <div className={styles.container}>
          <div className={styles.founderGrid}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={styles.founderImageCol}
            >
              <div className={styles.founderImgFrame}>
                {content.founderImage && (
                  <img src={content.founderImage} alt="Julia Marse Founder" className={styles.founderImg} />
                )}
                <div className={styles.founderImgBorder}></div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={styles.founderTextCol}
            >
              <div className={styles.founderWatermark}>MARSE</div>
              
              <div className={styles.subtitleWrapper}>
                <span className={styles.subtitle}>ACADEMY FOUNDER</span>
                <div className={styles.subtitleLine}></div>
              </div>
              <h2 className={styles.founderName}>{content.founderName}</h2>
              <h3 className={styles.founderTitle}>{content.founderTitle}</h3>
              
              <p className={styles.paragraph}>{content.founderBio1}</p>
              <p className={styles.paragraph}>{content.founderBio2}</p>
              
              {content.founderSignature && (
                <div className={styles.founderSigWrapper}>
                  <p className={styles.founderSig}>{content.founderSignature}</p>
                  <div className={styles.signatureLine}></div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Educational Philosophy & Values - Dark High Contrast */}
      <section className={styles.philosophySection}>
        <div className={styles.container}>
          <div className={styles.subtitleWrapper}>
            <span className={styles.subtitle} style={{ color: '#C7A56A' }}>ACADEMY VALUES</span>
            <div className={styles.subtitleLine} style={{ backgroundColor: '#C7A56A' }}></div>
          </div>
          <h2 className={styles.sectionHeading} style={{ color: '#FFFFFF' }}>EDUCATIONAL PHILOSOPHY</h2>
          
          <div className={styles.valuesGrid}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={styles.valueCard}
            >
              <div className={styles.valueIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C7A56A" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h4>Learning by Doing</h4>
              <p>We teach through practical creativity, real photoshoots, runway rehearsals, and screen acting tasks.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={styles.valueCard}
            >
              <div className={styles.valueIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C7A56A" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M16 3.13a4 4 0 0 1 0 7.75" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <h4>Individuality</h4>
              <p>We respect and nurture the unique creative voice and personality of each child.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={styles.valueCard}
            >
              <div className={styles.valueIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C7A56A" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h4>Professionalism</h4>
              <p>Students learn time management, team collaboration, and set etiquette from day one.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={styles.valueCard}
            >
              <div className={styles.valueIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C7A56A" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h4>Respect & Inclusion</h4>
              <p>A welcoming environment where diversity is celebrated and mutual respect is standard.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Safeguarding Culture - Black & Gold Banner */}
      <section className={styles.safeguardingSection}>
        <div className={styles.container}>
          <div className={styles.safeguardingCard}>
            <div className={styles.safeguardingBadge}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C7A56A" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 className={styles.safeguardingTitle}>{content.safeguardingTitle}</h2>
            <p className={styles.safeguardingText}>{content.safeguardingText}</p>
            <a href="/legal/safeguarding" className={styles.safeguardingLink}>
              Read our full Safeguarding Policy
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginLeft: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
