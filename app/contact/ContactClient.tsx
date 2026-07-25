'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './contact.module.css';

interface ContactClientProps {
  initialSettings?: any;
}

export default function ContactClient({ initialSettings }: ContactClientProps) {
  const [globalSettings, setGlobalSettings] = useState({
    supportWhatsapp: '1234567890',
    supportEmail: 'admissions@marse-academy.com',
    contactTitle: 'CONTACT MARSE ACADEMY',
    contactLead: 'Reach our registration and student support teams. Submit your enquiry below or contact us via WhatsApp for instant admissions support.',
    contactAddress: 'MARSE Academy London Studio, Westminster, SW1P, United Kingdom',
    contactHours1: 'Monday - Friday: 09:00 - 18:00',
    contactHours2: 'Saturday - Sunday: 08:30 - 17:30 (Class Sessions)',
    contactMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.5464676189524!2d-0.13098748423018247!3d51.49990267963333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604c2df9a57ab%3A0xe104cf4c74f53c1!2sWestminster%20Abbey%20Studio!5e0!3m2!1sen!2suk!4v1680000000000!5m2!1sen!2suk',
    ...initialSettings
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'programme',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setGlobalSettings((prev: any) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error('Failed to load global contact settings:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API form submission
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'programme',
        message: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
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
              <span className={styles.subtitle}>GET IN TOUCH</span>
              <div className={styles.subtitleLine}></div>
            </div>
            <h1 className={styles.heroTitle}>{globalSettings.contactTitle}</h1>
            <p className={styles.heroLead}>{globalSettings.contactLead}</p>
          </motion.div>
        </div>
      </section>

      {/* Content Columns */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            {/* Form Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={styles.formCol}
            >
              <h2 className={styles.sectionHeading}>SUBMIT AN ENQUIRY</h2>
              
              {success && (
                <div className={styles.successMessage}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C7A56A" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <p>Thank you! Your enquiry has been submitted. Our team will contact you shortly.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category">Enquiry Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={styles.select}
                  >
                    <option value="programme">Programme details & timetable</option>
                    <option value="application">Application status</option>
                    <option value="payment">Tuition fees & instalment plans</option>
                    <option value="partnership">Brand collaborations</option>
                    <option value="press">Press & media relations</option>
                    <option value="general">General enquiries</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    style={{ minHeight: '150px' }}
                  ></textarea>
                </div>

                <button type="submit" disabled={submitting} className={styles.submitBtn}>
                  {submitting ? 'Submitting...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Info Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={styles.infoCol}
            >
              {/* Map Embed Placeholder */}
              <div className={styles.mapContainer}>
                <iframe 
                  src={globalSettings.contactMapUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, borderRadius: '16px' }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Academy London Map"
                ></iframe>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C7A56A" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h4>Campus Location</h4>
                    <p>{globalSettings.contactAddress}</p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C7A56A" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4>Admissions Email</h4>
                    <p><a href={`mailto:${globalSettings.supportEmail}`}>{globalSettings.supportEmail}</a></p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C7A56A" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4>WhatsApp Support</h4>
                    <p><a href={`https://wa.me/${globalSettings.supportWhatsapp}`} target="_blank" rel="noopener noreferrer">+{globalSettings.supportWhatsapp}</a></p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C7A56A" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4>Opening Hours</h4>
                    <p>{globalSettings.contactHours1}</p>
                    <p>{globalSettings.contactHours2}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
