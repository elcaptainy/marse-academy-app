'use client';

import { motion } from 'framer-motion';
import styles from './WhyChooseMarse.module.css';

const PILLARS = [
  {
    num: '01',
    icon: 'auto_awesome',
    title: 'Multidisciplinary Creative Education',
    desc: 'Integrating fashion, modeling, acting, design, and photography into one cohesive, world-class curriculum.'
  },
  {
    num: '02',
    icon: 'verified_user',
    title: 'Professional Industry Teachers',
    desc: 'Direct instruction by active fashion directors, international casting agents, and top editorial photographers.'
  },
  {
    num: '03',
    icon: 'movie',
    title: 'Practical Projects & Productions',
    desc: 'Real studio camera shoots, live runway showcases, and professional production sets.'
  },
  {
    num: '04',
    icon: 'groups',
    title: 'Small Groups & Personal Attention',
    desc: 'Strictly capped cohort sizes (12–15 students) to ensure dedicated one-on-one mentor guidance.'
  },
  {
    num: '05',
    icon: 'photo_camera',
    title: 'Portfolio-Building Opportunities',
    desc: 'Graduate with an accredited digital portfolio, professional editorial headshots, and agency video cards.'
  },
  {
    num: '06',
    icon: 'shield_heart',
    title: 'Safe & Supportive Environment',
    desc: 'Complete safeguarding protocols, parent transparency, and an empowering atmosphere for young talents.'
  }
];

export default function WhyChooseMarse() {
  return (
    <section className={styles.section} id="why-choose-us">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.subtitleWrapper}>
            <span className={styles.subtitle}>EXCELLENCE IN EDUCATION</span>
            <div className={styles.subtitleLine}></div>
          </div>
          <h2 className={styles.title}>WHY CHOOSE MARSE ACADEMY</h2>
          <p className={styles.lead}>
            We provide a sanctuary of luxury creative learning built around confidence, safety, and professional execution.
          </p>
        </div>

        <div className={styles.grid}>
          {PILLARS.map((p, idx) => (
            <motion.div 
              key={p.num}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <span className={styles.num}>{p.num}</span>
                <span className={`material-symbols-outlined ${styles.icon}`}>{p.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDesc}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
