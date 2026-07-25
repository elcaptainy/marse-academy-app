'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQs.module.css';

export default function FAQs({ initialData }: { initialData?: any[] }) {
  const [faqData, setFaqData] = useState<any[]>(initialData || [
    {
      id: '1',
      question: 'What are the admission requirements for Marse Talent Academy?',
      answer: 'Admissions are highly selective. Applicants must submit their academic portfolio, undergo a personal interview, and demonstrate a strong commitment to global leadership, luxury photography, or modeling. We review every application holistically.'
    },
    {
      id: '2',
      question: 'How do the payment plans work?',
      answer: 'We offer three tuition payment schedules: Monthly installments ($4,500/mo), Quarterly payments ($12,500/quarter), and Full Annual enrollment ($48,000/year). Annual enrollment includes complete priority access to all workshops, international events, and dedicated mentorship.'
    },
    {
      id: '3',
      question: 'Where are the international workshops located?',
      answer: 'Marse Talent Academy conducts physical workshops in key global hubs, primarily Vienna (Austria) and London (United Kingdom). Annual members receive a Global Campus Pass granting unrestricted entry to all workshop facilities.'
    },
    {
      id: '4',
      question: 'Is the curriculum suitable for beginner students?',
      answer: 'Yes, our curriculum spans from advanced fundamentals to elite mastery. Mentors tailor projects and case studies based on each student\'s current expertise to ensure an accelerated professional growth path.'
    },
    {
      id: '5',
      question: 'Can guardians monitor the academic progress of the student?',
      answer: 'Absolutely. We provide term-based progress reviews, academic advisory sessions, and direct parent-mentor conferences to review student growth and plan future career opportunities.'
    }
  ]);

  const [activeIndex, setActiveIndex] = useState<number | string | null>(null);

  useEffect(() => {
    fetch('/api/faqs')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setFaqData(data);
      })
      .catch(err => console.error('Failed to fetch FAQs:', err));
  }, []);

  const toggleFAQ = (id: number | string) => {
    setActiveIndex(prev => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className={styles.section}>
      <div className={styles.header}>
        <p className={styles.subtitle}>Common Questions</p>
        <h2 className={styles.title}>Frequently Asked Questions</h2>
      </div>

      <div className={styles.faqContainer}>
        {faqData.map((item) => {
          const isOpen = activeIndex === item.id;
          return (
            <div 
              key={item.id} 
              className={`${styles.faqItem} ${isOpen ? styles.faqItemActive : ''}`}
            >
              <div 
                className={styles.questionRow} 
                onClick={() => toggleFAQ(item.id)}
              >
                <h3 className={styles.question}>{item.question}</h3>
                <svg 
                  className={styles.arrow} 
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
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className={styles.answerContainer}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <p className={styles.answer}>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
