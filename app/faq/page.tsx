'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './faq.module.css';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/faqs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFaqs(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load FAQs:', err);
        setLoading(false);
      });
  }, []);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

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
              <span className={styles.subtitle}>HELP & DOCUMENTATION</span>
              <div className={styles.subtitleLine}></div>
            </div>
            <h1 className={styles.heroTitle}>FREQUENTLY ASKED QUESTIONS</h1>
            <p className={styles.heroLead}>
              Find clear information about age group classifications, session schedules, tuition payment plans, casting opportunities, and media consent rules.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ List Accordions */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <div className={styles.spinner}></div>
              <p>Loading FAQs...</p>
            </div>
          ) : (
            <div className={styles.faqList}>
              {faqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div key={faq.id} className={styles.faqItem}>
                    <button 
                      onClick={() => toggleFAQ(faq.id)} 
                      className={styles.questionButton}
                      aria-expanded={isOpen}
                    >
                      <span className={styles.questionText}>{faq.question}</span>
                      <svg 
                        className={`${styles.arrowIcon} ${isOpen ? styles.arrowOpen : ''}`} 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className={styles.answerWrapper}
                        >
                          <div className={styles.answerText}>
                            <p>{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
