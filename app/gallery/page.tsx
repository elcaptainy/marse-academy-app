'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './gallery.module.css';

interface GalleryItem {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  category?: string;
  size: 'SQUARE' | 'WIDE' | 'TALL';
  altText: string;
}

const CATEGORIES = [
  'ALL',
  'CLASSES',
  'FASHION',
  'PHOTOGRAPHY',
  'ACTING',
  'BEHIND THE SCENES',
  'STUDENT PROJECTS',
  'SHOWS',
  'VIDEO'
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  
  const currentIdx = lightboxItem ? filteredItems.findIndex((i) => i.id === lightboxItem.id) : -1;

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Add default categories if missing from schema mapping
          const mapped = data.map((item, idx) => {
            const cats = ['CLASSES', 'FASHION', 'PHOTOGRAPHY', 'ACTING', 'BEHIND THE SCENES'];
            return {
              ...item,
              category: item.category || cats[idx % cats.length]
            };
          });
          setItems(mapped);
          setFilteredItems(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load gallery:', err);
      });
  }, []);

  // Keydown listener for lightbox media navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxItem) return;
      const currentIdx = filteredItems.findIndex((i) => i.id === lightboxItem.id);
      if (currentIdx === -1) return;

      if (e.key === 'ArrowRight' && currentIdx < filteredItems.length - 1) {
        setLightboxItem(filteredItems[currentIdx + 1]);
      } else if (e.key === 'ArrowLeft' && currentIdx > 0) {
        setLightboxItem(filteredItems[currentIdx - 1]);
      } else if (e.key === 'Escape') {
        setLightboxItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem, filteredItems]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'ALL') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === cat));
    }
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
              <span className={styles.subtitle}>EDITORIAL PORTFOLIO</span>
              <div className={styles.subtitleLine}></div>
            </div>
            <h1 className={styles.heroTitle}>GRADUATE WORK & PRODUCTION SHOWCASE</h1>
            <p className={styles.heroLead}>
              Explore our curated portfolio mixing high-fashion photography, acting reel previews, costume styling, and behind-the-scenes moments from real production sets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className={styles.filterSection}>
        <div className={styles.container}>
          <div className={styles.categoryFilters}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className={styles.gallerySection}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <div className={styles.spinner}></div>
              <p>Loading showcase...</p>
            </div>
          ) : (
            <motion.div layout className={styles.grid}>
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    key={item.id}
                    className={`${styles.gridItem} ${styles[item.size.toLowerCase()]}`}
                    onClick={() => setLightboxItem(item)}
                  >
                    <div className={styles.mediaContainer}>
                      {item.type === 'VIDEO' ? (
                        <div className={styles.videoPlaceholder}>
                          <video src={item.url} muted loop autoPlay playsInline className={styles.media} />
                          <div className={styles.videoOverlay}>
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="currentColor"
                              style={{ color: '#ffffff', marginLeft: '2px' }}
                            >
                              <polygon points="6 3 20 12 6 21 6 3"></polygon>
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <img src={item.url} alt={item.altText} className={styles.media} />
                      )}
                      
                      <div className={styles.overlay}>
                        <span className={styles.itemCategory}>{item.category}</span>
                        <span className={styles.itemAlt}>{item.altText}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.lightbox}
            onClick={() => setLightboxItem(null)}
          >
            <button className={styles.closeBtn} onClick={() => setLightboxItem(null)}>&times;</button>
            
            {/* Previous Button */}
            {currentIdx > 0 && (
              <button 
                className={styles.prevBtn} 
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxItem(filteredItems[currentIdx - 1]);
                }}
                aria-label="Previous Media"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}

            <motion.div 
              key={lightboxItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={styles.lightboxContent} 
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxItem.type === 'VIDEO' ? (
                <video src={lightboxItem.url} controls autoPlay className={styles.lightboxMedia} />
              ) : (
                <img src={lightboxItem.url} alt={lightboxItem.altText} className={styles.lightboxMedia} />
              )}
              <div className={styles.lightboxInfo}>
                <h3>{lightboxItem.category}</h3>
                <p>{lightboxItem.altText}</p>
              </div>
            </motion.div>

            {/* Next Button */}
            {currentIdx < filteredItems.length - 1 && (
              <button 
                className={styles.nextBtn} 
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxItem(filteredItems[currentIdx + 1]);
                }}
                aria-label="Next Media"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
