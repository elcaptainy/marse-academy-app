'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // Check initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className={styles.menuButton}
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
              )}
            </button>
            <Link href="/" onClick={scrollToTop} className={styles.logoWrapper}>
              <div className={styles.logoAbbr}>
                <span>M</span>
                <span className={styles.logoDivider}>|</span>
                <span>A</span>
                <span className={styles.logoDivider}>|</span>
              </div>
              <div className={styles.logoText}>
                <div className={styles.logoMain}>MARSE</div>
                <div className={styles.logoSub}>ACADEMY OF</div>
                <div className={styles.logoSub2}>FASHION & ARTS</div>
              </div>
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
            <Link href="/programme" className={styles.navLink}>
              Programme
            </Link>
            <Link href="/teachers" className={styles.navLink}>
              Teachers
            </Link>
            <Link href="/gallery" className={styles.navLink}>
              Gallery
            </Link>
            <Link href="/admissions" className={styles.navLink}>
              Admissions
            </Link>
            <Link href="/faq" className={styles.navLink}>
              FAQ
            </Link>
            <Link href="/contact" className={styles.navLink}>
              Contact
            </Link>
          </nav>
          <div className={styles.actions}>
            <Link href="/portal" className={styles.navLink} style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', color: '#C7A56A' }}>
              Portal
            </Link>
            <Link href="/admissions#apply" className={styles.applyButton}>
              Apply Now
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.mobileDrawerOpen : ''}`}>
        <nav className={styles.mobileNav}>
          <Link href="/" onClick={handleLinkClick} className={styles.mobileNavLink}>
            Home
          </Link>
          <Link href="/about" onClick={handleLinkClick} className={styles.mobileNavLink}>
            About
          </Link>
          <Link href="/programme" onClick={handleLinkClick} className={styles.mobileNavLink}>
            Programme
          </Link>
          <Link href="/teachers" onClick={handleLinkClick} className={styles.mobileNavLink}>
            Teachers
          </Link>
          <Link href="/gallery" onClick={handleLinkClick} className={styles.mobileNavLink}>
            Gallery
          </Link>
          <Link href="/admissions" onClick={handleLinkClick} className={styles.mobileNavLink}>
            Admissions
          </Link>
          <Link href="/portal" onClick={handleLinkClick} className={styles.mobileNavLink} style={{ color: '#C7A56A' }}>
            Portal
          </Link>
          <Link href="/faq" onClick={handleLinkClick} className={styles.mobileNavLink}>
            FAQ
          </Link>
          <Link href="/contact" onClick={handleLinkClick} className={styles.mobileNavLink}>
            Contact
          </Link>
          <Link href="/admissions#apply" onClick={handleLinkClick} className={styles.mobileApplyBtn}>
            Apply Now
          </Link>
        </nav>
      </div>
    </>
  );
}
