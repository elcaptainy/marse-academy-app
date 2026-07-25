'use client';
import { useState, useEffect } from 'react';
import styles from './Footer.module.css';

interface GalleryItem {
  id: string;
  type: string;
  url: string;
  altText: string;
}

export default function Footer() {
  const [globalSettings, setGlobalSettings] = useState<any>({
    supportWhatsapp: '1234567890',
    supportEmail: 'marse.academy.support@gmail.com',
    showStats: true,
    showFooterGallery: true,
    stat1Value: '20+',
    stat1Label: 'COUNTRIES',
    stat2Value: '50+',
    stat2Label: 'INDUSTRY PROFESSIONALS',
    stat3Value: '1000+',
    stat3Label: 'STUDENTS EMPOWERED',
    stat4Value: '95%',
    stat4Label: 'SUCCESS RATE',
    instagramUrl: 'https://instagram.com',
    tiktokUrl: 'https://tiktok.com',
    youtubeUrl: 'https://youtube.com',
    pinterestUrl: 'https://pinterest.com'
  });

  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    // Fetch settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) setGlobalSettings((prev: any) => ({ ...prev, ...data }));
      })
      .catch((err) => console.error('Failed to load global contact settings in footer:', err));

    // Fetch gallery images
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter to only image types and map to their URL
          const imageUrls = data
            .filter((x: any) => x.type === 'IMAGE')
            .map((x: any) => x.url);
          setGalleryImages(imageUrls);
        }
      })
      .catch((err) => console.error('Failed to load gallery images in footer:', err));
  }, []);

  // Standard fallback gallery images in case of empty list
  const fallbackImages = [
    '/gallery-1.jpg',
    '/gallery-2.jpg',
    '/gallery-3.jpg',
    '/gallery-4.jpg',
    '/gallery-5.jpg'
  ];

  const displayImages = galleryImages.length >= 5 
    ? galleryImages.slice(0, 5) 
    : [...galleryImages, ...fallbackImages].slice(0, 5);

  return (
    <footer className={styles.footer}>
      {/* 1. Stats Panel */}
      {globalSettings.showStats && (
        <section className={styles.statsSection}>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <span className="material-symbols-outlined">language</span>
              <h3>{globalSettings.stat1Value}</h3>
              <p>{globalSettings.stat1Label}</p>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statCard}>
              <span className="material-symbols-outlined">person</span>
              <h3>{globalSettings.stat2Value}</h3>
              <p>{globalSettings.stat2Label}</p>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statCard}>
              <span className="material-symbols-outlined">group</span>
              <h3>{globalSettings.stat3Value}</h3>
              <p>{globalSettings.stat3Label}</p>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statCard}>
              <span className="material-symbols-outlined">star</span>
              <h3>{globalSettings.stat4Value}</h3>
              <p>{globalSettings.stat4Label}</p>
            </div>
          </div>
        </section>
      )}

      {/* 2. Gallery Strip */}
      {globalSettings.showFooterGallery && (
        <section className={styles.galleryStrip}>
          {displayImages.map((url, idx) => (
            <div key={idx} className={styles.galleryImgWrapper}>
              <img src={url} alt={`Gallery Strip ${idx + 1}`} className={styles.galleryStripImg} />
              {idx === 2 && (
                <div className={styles.viewGalleryOverlay}>
                  <a href="/gallery" className={styles.viewGalleryBtn}>VIEW GALLERY</a>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 3. Footer Columns */}
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Logo & Brand Details */}
          <div className={styles.brandCol}>
            <div className={styles.brandTitleContainer}>
              <div className={styles.logoAbbr}>
                <span>M</span>
                <span className={styles.logoDivider}>|</span>
                <span>A</span>
                <span className={styles.logoDivider}>|</span>
              </div>
              <div className={styles.logoText}>
                <h4 className={styles.logoMain}>MARSE</h4>
                <p className={styles.logoSub}>ACADEMY OF</p>
                <p className={styles.logoSub2}>FASHION & ARTS</p>
              </div>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>NAVIGATION</h4>
            <ul className={styles.linkList}>
              <li><a href="/" className={styles.footerLink}>Home</a></li>
              <li><a href="/about" className={styles.footerLink}>About</a></li>
              <li><a href="/programme" className={styles.footerLink}>Programs</a></li>
              <li><a href="/admissions" className={styles.footerLink}>Admissions</a></li>
              <li><a href="/gallery" className={styles.footerLink}>Gallery</a></li>
              <li><a href="/contact" className={styles.footerLink}>Contact</a></li>
            </ul>
          </div>

          {/* Programs Column */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>PROGRAMS</h4>
            <ul className={styles.linkList}>
              <li><a href="/programme" className={styles.footerLink}>Fashion & Modeling</a></li>
              <li><a href="/programme" className={styles.footerLink}>Performing Arts</a></li>
              <li><a href="/programme" className={styles.footerLink}>Fashion Design</a></li>
              <li><a href="/programme" className={styles.footerLink}>Photography</a></li>
              <li><a href="/programme" className={styles.footerLink}>Creative Arts</a></li>
            </ul>
          </div>

          {/* Info Column */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>INFO</h4>
            <ul className={styles.linkList}>
              <li><a href="/admissions" className={styles.footerLink}>Apply Now</a></li>
              <li><a href="/faq" className={styles.footerLink}>FAQ</a></li>
              <li><a href="/programme" className={styles.footerLink}>News</a></li>
              <li><a href="/legal/privacy" className={styles.footerLink}>Privacy Policy</a></li>
              <li><a href="/legal/terms" className={styles.footerLink}>Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>CONNECT</h4>
            <div className={styles.socials}>
              {globalSettings.instagramUrl && (
                <a href={globalSettings.instagramUrl} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {globalSettings.tiktokUrl && (
                <a href={globalSettings.tiktokUrl} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                </a>
              )}
              {globalSettings.youtubeUrl && (
                <a href={globalSettings.youtubeUrl} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              )}
              {globalSettings.pinterestUrl && (
                <a href={globalSettings.pinterestUrl} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 22a9 9 0 0 1-2.28-7.85c.67-4.22 3.8-7.73 8-8.8A9 9 0 0 1 20 12c0 4.14-3.1 7.23-7.23 7.23a4 4 0 0 1-3.66-2.58L8 22z"></path></svg>
                </a>
              )}
            </div>
            <div className={styles.contactDetails}>
              <a href={`mailto:${globalSettings.supportEmail}`} className={styles.footerLink} style={{ textTransform: 'lowercase' }}>
                {globalSettings.supportEmail}
              </a>
              <p className={styles.contactText}>London, United Kingdom</p>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>
        <p className={styles.copyright}>© 2025 MARSE ACADEMY OF FASHION & ARTS. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
