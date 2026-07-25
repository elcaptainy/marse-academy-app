'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ContactWidget.module.css';

export default function ContactWidget() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('1234567890');
  const [emailAddress, setEmailAddress] = useState('admissions@marse-academy.com');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.supportWhatsapp) setWhatsappNumber(data.supportWhatsapp);
          if (data.supportEmail) setEmailAddress(data.supportEmail);
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  // Show bubble after 4 seconds automatically, then hide it after 8 seconds of visibility
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowBubble(true);
      const hideTimer = setTimeout(() => {
        setShowBubble(false);
      }, 8000);
      return () => clearTimeout(hideTimer);
    }, 4000);

    return () => clearTimeout(showTimer);
  }, []);

  // Hide bubble when widget opens
  const handleToggle = () => {
    setOpen(prev => !prev);
    setShowBubble(false);
  };

  return (
    <div className={styles.wrapper}>

      {/* Greeting bubble */}
      <AnimatePresence>
        {showBubble && !open && (
          <motion.div
            className={styles.bubble}
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Small close button for the bubble */}
            <button 
              className={styles.bubbleCloseBtn} 
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
              title="Dismiss"
            >
              &times;
            </button>
            <p className={styles.bubbleName}>Marse Talent Academy</p>
            <p className={styles.bubbleText}>👋 How can we assist you today?</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.actions}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* WhatsApp */}
            <motion.a
              href={`https://wa.me/${whatsappNumber}?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20Marse Talent%20Academy.`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionBtn} ${styles.whatsappBtn}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </motion.a>

            {/* Email */}
            <motion.a
              href={`mailto:${emailAddress}?subject=Inquiry%20-%20Marse Talent%20Academy`}
              className={`${styles.actionBtn} ${styles.emailBtn}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.25 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              Send an Email
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        className={styles.mainBtn}
        onClick={handleToggle}
        whileTap={{ scale: 0.92 }}
        aria-label="Contact support"
      >
        {!open && <div className={styles.pulse} />}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12"/>
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

    </div>
  );
}
