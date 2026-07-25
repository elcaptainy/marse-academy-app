'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Testimonials.module.css';

export default function Testimonials({ initialData }: { initialData?: any[] }) {
  const [testimonials, setTestimonials] = useState<any[]>(initialData || [
    {
      id: '1',
      quote: "Marse Talent Academy transformed my creative photography. The mentorship with Julia Marse was unmatched. They don't just teach techniques; they define your vision as an artist.",
      author: "Elena Rostova",
      role: "Fine Art Photographer & Alumna"
    },
    {
      id: '2',
      quote: "The networking opportunities alone are worth the investment. Through their London workshops, I secured my first major campaign with an international fashion brand.",
      author: "Maximilian Keller",
      role: "Editorial Model & Graduate"
    },
    {
      id: '3',
      quote: "Investing in my daughter's education at Marse Talent was the best decision. The structured feedback and global campus access gave her a competitive edge in international design.",
      author: "Dr. Albert Weber",
      role: "Parent of Annual Member"
    }
  ]);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setTestimonials(data);
      })
      .catch(err => console.error('Failed to fetch testimonials:', err));
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleDotClick = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.header}>
        <p className={styles.subtitle}>Success Stories</p>
        <h2 className={styles.title}>Client Testimonials</h2>
      </div>

      <div className={styles.carouselWrapper}>
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', minHeight: '340px' }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className={styles.testimonialCard}
            >
              <span className={`material-symbols-outlined ${styles.quoteIcon}`}>
                format_quote
              </span>
              <p className={styles.quoteText}>
                "{testimonials[index].quote}"
              </p>
              <div className={styles.authorWrapper}>
                <h4 className={styles.authorName}>{testimonials[index].author}</h4>
                <p className={styles.authorRole}>{testimonials[index].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel controls */}
        <div className={styles.controls}>
          <button onClick={prevSlide} className={styles.navBtn} aria-label="Previous testimonial">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          
          <div className={styles.dots}>
            {testimonials.map((_, i) => (
              <span
                key={i}
                onClick={() => handleDotClick(i)}
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              />
            ))}
          </div>

          <button onClick={nextSlide} className={styles.navBtn} aria-label="Next testimonial">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}
