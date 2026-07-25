'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Gallery.module.css';

export default function Gallery({ initialData }: { initialData?: any[] }) {
  const [galleryItems, setGalleryItems] = useState<any[]>(initialData || [
    { id: '1', type: 'VIDEO', url: '/london-workshop.mp4', size: 'LARGE_SQUARE', altText: 'London Workshop' },
    { id: '2', type: 'IMAGE', url: '/gallery-1.jpg', size: 'WIDE', altText: 'Campus Life' },
    { id: '3', type: 'IMAGE', url: '/gallery-2.jpg', size: 'SQUARE', altText: 'Students' },
    { id: '4', type: 'IMAGE', url: '/gallery-3.jpg', size: 'SQUARE', altText: 'Events' },
    { id: '5', type: 'VIDEO', url: '/vienna-workshop.mp4', size: 'TALL', altText: 'Vienna Workshop' },
    { id: '6', type: 'IMAGE', url: '/gallery-4.jpg', size: 'SQUARE', altText: 'Excellence' },
    { id: '7', type: 'IMAGE', url: '/gallery-5.jpg', size: 'WIDE', altText: 'Networking' }
  ]);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => { if (data && data.length > 0) setGalleryItems(data); })
      .catch(() => {});
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
    if (videoRef.current) videoRef.current.pause();
  }, []);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    if (videoRef.current) videoRef.current.pause();
    setLightboxIndex((lightboxIndex + 1) % galleryItems.length);
  }, [lightboxIndex, galleryItems.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    if (videoRef.current) videoRef.current.pause();
    setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length);
  }, [lightboxIndex, galleryItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  const currentItem = lightboxIndex !== null ? galleryItems[lightboxIndex] : null;

  return (
    <>
      <section id="campus" className={styles.section}>
        <div className={styles.header}>
          <p className={styles.subtitle}>Final Projects & Gallery</p>
          <h2 className={styles.title}>Graduate Showcase</h2>
        </div>

        <div className={styles.bentoGrid}>
          {galleryItems.slice(0, 10).map((item, index) => {
            let sizeClass = styles.smallSquare;
            if (item.size === 'WIDE') sizeClass = styles.wideRect;
            else if (item.size === 'TALL') sizeClass = styles.tallRect;
            else if (item.size === 'LARGE_SQUARE' || item.size === 'LARGE') sizeClass = styles.largeSquare;

            return (
              <motion.div
                key={item.id}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: Math.min(index * 0.08, 0.4) }}
                className={`${styles.bentoItem} ${sizeClass}`}
                onClick={() => openLightbox(index)}
                role="button"
                aria-label={`View ${item.altText}`}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') openLightbox(index); }}
              >
                {item.type === 'VIDEO' ? (
                  <video
                    key={item.url}
                    className={styles.media}
                    src={item.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img src={item.url} alt={item.altText} className={styles.media} />
                )}
                <div className={styles.overlay}>
                  {/* Play / Zoom icon */}
                  <div className={styles.overlayIcon}>
                    {item.type === 'VIDEO' ? (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    ) : (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    )}
                  </div>
                  <span className={styles.overlayLabel}>{item.altText}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {galleryItems.length > 10 && (
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a 
              href="/gallery" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid #0A0A0A',
                padding: '14px 36px',
                borderRadius: '0px',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#0A0A0A',
                backgroundColor: 'transparent',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              VIEW FULL GALLERY &rarr;
            </a>
          </div>
        )}
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            className={styles.lightboxBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
          >
            {/* Counter */}
            <div className={styles.lightboxCounter}>
              {(lightboxIndex! + 1)} / {galleryItems.length}
            </div>

            {/* Close button */}
            <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Close">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Prev arrow */}
            <button
              className={`${styles.lightboxArrow} ${styles.lightboxArrowLeft}`}
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Media container */}
            <motion.div
              key={currentItem.id}
              className={styles.lightboxContent}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              {currentItem.type === 'VIDEO' ? (
                <video
                  ref={videoRef}
                  key={currentItem.url}
                  className={styles.lightboxMedia}
                  src={currentItem.url}
                  controls
                  autoPlay
                  playsInline
                  controlsList="nofullscreen"
                  {...{ "webkit-playsinline": "true" }}
                />
              ) : (
                <img
                  src={currentItem.url}
                  alt={currentItem.altText}
                  className={styles.lightboxMedia}
                />
              )}

              {/* Caption bar */}
              <div className={styles.lightboxCaption}>
                <div className={styles.lightboxCaptionIcon}>
                  {currentItem.type === 'VIDEO' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  )}
                  <span>{currentItem.type === 'VIDEO' ? 'Video' : 'Photo'}</span>
                </div>
                <p>{currentItem.altText}</p>
              </div>

              {/* Thumbnail strip */}
              <div className={styles.lightboxThumbs}>
                {galleryItems.map((item, i) => (
                  <button
                    key={item.id}
                    className={`${styles.lightboxThumb} ${i === lightboxIndex ? styles.lightboxThumbActive : ''}`}
                    onClick={(e) => { e.stopPropagation(); if (videoRef.current) videoRef.current.pause(); setLightboxIndex(i); }}
                    aria-label={item.altText}
                  >
                    {item.type === 'VIDEO' ? (
                      <video src={item.url} muted className={styles.lightboxThumbMedia} />
                    ) : (
                      <img src={item.url} alt={item.altText} className={styles.lightboxThumbMedia} />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Next arrow */}
            <button
              className={`${styles.lightboxArrow} ${styles.lightboxArrowRight}`}
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
