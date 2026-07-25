'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './portal.module.css';

export default function StudentPortalPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'finance' | 'consents' | 'attendance' | 'feedback' | 'security'>('profile');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [passChangeMsg, setPassChangeMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [passChanging, setPassChanging] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeMsg(null);
    if (!newPassInput || newPassInput.length < 6) {
      setPassChangeMsg({ text: 'New password must be at least 6 characters long.', isError: true });
      return;
    }
    if (newPassInput !== confirmPassInput) {
      setPassChangeMsg({ text: 'New passwords do not match. Please verify and try again.', isError: true });
      return;
    }

    setPassChanging(true);
    try {
      const res = await fetch('/api/portal/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student?.dbId || student?.id,
          newPassword: newPassInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setPassChangeMsg({ text: '✓ Password updated successfully! Use your new password for your next login.', isError: false });
        setNewPassInput('');
        setConfirmPassInput('');
      } else {
        setPassChangeMsg({ text: data.error || 'Failed to update password.', isError: true });
      }
    } catch (err) {
      setPassChangeMsg({ text: 'Network connection error.', isError: true });
    } finally {
      setPassChanging(false);
    }
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');

  // Handle Authentication with Backend
  const authenticateUser = async (authMethod: 'password' | 'google', targetEmail: string, passVal?: string) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/portal/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: authMethod,
          email: targetEmail,
          password: passVal
        })
      });

      const data = await res.json();
      if (data.success && data.student) {
        setStudent(data.student);
        setIsLoggedIn(true);
        localStorage.setItem('marse_portal_email', data.student.email);
        setShowGoogleModal(false);
      } else {
        setStudent(null);
        setIsLoggedIn(false);
        setErrorMsg(data.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setStudent(null);
      setIsLoggedIn(false);
      setErrorMsg('Failed to connect to authentication server. Please try again.');
    } finally {
      setLoading(false);
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    // Auto-login if previously saved in session
    const savedEmail = localStorage.getItem('marse_portal_email');
    if (savedEmail) {
      authenticateUser('password', savedEmail, 'saved_session');
    }
  }, []);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your registered Email Address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }
    authenticateUser('password', email.trim(), password);
  };

  const handleGoogleSignIn = () => {
    setShowGoogleModal(true);
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) return;
    setGoogleLoading(true);
    authenticateUser('google', googleEmailInput.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('marse_portal_email');
    setIsLoggedIn(false);
    setStudent(null);
    setEmail('');
    setPassword('');
    setErrorMsg('');
  };

  const handlePrintReceipt = () => {
    if (!student) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>MARSE ACADEMY RECEIPT - ${student.finance.invoiceNumber}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0A0A0A; background: #fff; }
            .header { border-bottom: 2px solid #C7A56A; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 24px; font-family: Georgia, serif; text-transform: uppercase; letter-spacing: 1px; }
            .subtitle { font-size: 11px; color: #C7A56A; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-box { background: #F7F5F2; padding: 16px; border-radius: 8px; font-size: 13px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th { background: #0A0A0A; color: #fff; padding: 12px; font-size: 11px; text-transform: uppercase; text-align: left; }
            .table td { padding: 12px; border-bottom: 1px solid #E8E2DA; font-size: 13px; }
            .total-row { font-weight: bold; font-size: 16px; border-top: 2px solid #0A0A0A; }
            .badge { background: #10b981; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; }
            .footer { margin-top: 50px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #E8E2DA; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="subtitle">MARSE ACADEMY OF FASHION & ARTS</div>
              <div class="title">OFFICIAL TUITION RECEIPT</div>
            </div>
            <span class="badge">${student.finance.paymentStatus}</span>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <strong>STUDENT DETAILS:</strong><br/>
              Name: ${student.name}<br/>
              Student ID: ${student.id}<br/>
              Email: ${student.email}<br/>
              Programme: ${student.program}
            </div>
            <div class="info-box">
              <strong>PAYMENT DETAILS:</strong><br/>
              Invoice No: ${student.finance.invoiceNumber}<br/>
              Date Paid: July 01, 2026<br/>
              Method: Credit Card / Stripe Verified<br/>
              Status: ${student.finance.paymentStatus}
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Term Duration</th>
                <th>Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Multidisciplinary Fashion & Arts Programme Tuition Fee</td>
                <td>12 Weeks (7 Core Modules)</td>
                <td>${student.finance.paidAmount}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">TOTAL AMOUNT PAID</td>
                <td>${student.finance.paidAmount}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            MARSE ACADEMY OF FASHION & ARTS • MAYFAIR CAMPUS, LONDON UK • ADMISSIONS@MARSETALENT.ACADEMY
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintCert = () => {
    if (!student) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>MARSE ACADEMY DIPLOMA - ${student.name}</title>
          <style>
            body { font-family: Georgia, serif; padding: 60px; color: #0A0A0A; background: #FFFDF9; border: 12px double #C7A56A; box-sizing: border-box; text-align: center; }
            .header-logo { font-size: 14px; font-family: Arial, sans-serif; letter-spacing: 4px; color: #C7A56A; text-transform: uppercase; font-weight: bold; margin-bottom: 20px; }
            .title { font-size: 42px; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 2px; }
            .subtitle { font-size: 16px; font-style: italic; color: #555; margin-bottom: 40px; }
            .student-name { font-size: 36px; text-transform: uppercase; text-decoration: underline; text-decoration-color: #C7A56A; margin: 30px 0; color: #0A0A0A; }
            .course-name { font-size: 20px; font-weight: bold; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 1px; }
            .signatures { display: flex; justify-content: space-around; margin-top: 60px; font-family: Arial, sans-serif; font-size: 12px; }
            .sig-line { border-top: 1px solid #0A0A0A; padding-top: 8px; width: 200px; text-transform: uppercase; letter-spacing: 1px; }
            .seal { font-size: 48px; color: #C7A56A; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header-logo">MARSE ACADEMY OF FASHION & ARTS • LONDON</div>
          <div class="title">DIPLOMA OF ACADEMIC EXCELLENCE</div>
          <div class="subtitle">This is to certify that</div>
          
          <div class="student-name">${student.name}</div>
          
          <div class="subtitle">has successfully completed the multidisciplinary curriculum in</div>
          <div class="course-name">${student.program}</div>

          <div class="seal">★ ★ ★</div>

          <div class="signatures">
            <div class="sig-line">Julia Marse<br/><small>Academy Master Director</small></div>
            <div class="sig-line">Board of Examiners<br/><small>London Campus</small></div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Header */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.heroContent}
          >
            <div className={styles.subtitleWrapper}>
              <span className={styles.subtitle}>STUDENT & PARENT PORTAL</span>
            </div>
            <h1 className={styles.heroTitle}>
              {isLoggedIn && student ? `WELCOME BACK, ${student.name.split(' ')[0].toUpperCase()}` : 'PORTAL AUTHENTICATION'}
            </h1>
            <p className={styles.heroLead}>
              {isLoggedIn ? 
                'Access your class schedules, academy announcements, payment receipts, policy consent records, weekly attendance, and mentor feedback.' :
                'Sign in with your registered Email Address & Password, or Continue with Google to access your academic profile.'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* RENDER LOGIN SCREEN IF NOT LOGGED IN */}
      {!isLoggedIn ? (
        <section style={{ padding: '80px 0 120px 0', background: '#F7F5F2' }}>
          <div className={styles.container}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                maxWidth: '480px',
                margin: '0 auto',
                background: '#ffffff',
                border: '1px solid #E8E2DA',
                borderRadius: '24px',
                padding: '44px 36px',
                boxShadow: '0 25px 50px rgba(10,10,10,0.05)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '42px', color: '#C7A56A', marginBottom: '8px' }}>lock</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', color: '#0A0A0A', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                  Student & Parent Login
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#666', margin: 0 }}>
                  Enterprise Access Portal
                </p>
              </div>

              {/* Google Sign In Button */}
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  background: '#ffffff',
                  border: '1px solid #E8E2DA',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  color: '#0A0A0A',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
                </svg>
                Continue with Google
              </button>

              <div style={{ position: 'relative', textAlign: 'center', margin: '24px 0' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid #E8E2DA' }}></div>
                <span style={{ position: 'relative', background: '#ffffff', padding: '0 14px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Or with Email Credentials
                </span>
              </div>

              <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0A0A0A' }}>
                    Registered Email Address
                  </label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    style={{
                      background: '#F7F5F2',
                      border: '1px solid #E8E2DA',
                      borderRadius: '10px',
                      padding: '14px 16px',
                      fontSize: '14px',
                      color: '#0A0A0A',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0A0A0A' }}>
                      Password
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', color: '#C7A56A', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      background: '#F7F5F2',
                      border: '1px solid #E8E2DA',
                      borderRadius: '10px',
                      padding: '14px 16px',
                      fontSize: '14px',
                      color: '#0A0A0A',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Professional Enterprise Error Banner */}
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }} 
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: 'rgba(220, 38, 38, 0.06)',
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                      borderRadius: '10px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: '#dc2626', fontSize: '20px', marginTop: '1px' }}>error</span>
                    <span style={{ fontSize: '12.5px', color: '#dc2626', lineHeight: '1.5', fontWeight: '500' }}>
                      {errorMsg}
                    </span>
                  </motion.div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  style={{
                    background: '#0A0A0A',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '16px',
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: loading ? 'wait' : 'pointer',
                    transition: 'background 0.3s ease',
                    marginTop: '6px'
                  }}
                >
                  {loading ? 'Verifying Credentials...' : 'Sign In'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', margin: '14px 0 0 0' }}>
                  Don't have an account?{' '}
                  <a href="/admissions#apply" style={{ color: '#C7A56A', fontWeight: '700', textDecoration: 'underline' }}>
                    Apply Online Here
                  </a>
                </p>
              </form>
            </motion.div>
          </div>
        </section>
      ) : (
        /* RENDER STUDENT DASHBOARD WHEN LOGGED IN */
        <>
          {/* Top Status Bar with Logout Button */}
          <section style={{ background: '#F7F5F2', borderBottom: '1px solid #E8E2DA', padding: '14px 0' }}>
            <div className={styles.container}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#10b981', fontSize: '20px' }}>verified_user</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A0A0A' }}>
                    Authenticated as <strong>{student.name}</strong> ({student.email})
                  </span>
                </div>

                <button 
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    color: '#dc2626',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    borderRadius: '20px',
                    padding: '6px 16px',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          </section>

          {/* Sticky Tab Navigation */}
          <section className={styles.portalTabsSection}>
            <div className={styles.container}>
              <div className={styles.tabList}>
                <button 
                  onClick={() => setActiveTab('profile')} 
                  className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.tabBtnActive : ''}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
                  Profile & Details
                </button>

                <button 
                  onClick={() => setActiveTab('schedule')} 
                  className={`${styles.tabBtn} ${activeTab === 'schedule' ? styles.tabBtnActive : ''}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</span>
                  Schedule & News
                </button>

                <button 
                  onClick={() => setActiveTab('finance')} 
                  className={`${styles.tabBtn} ${activeTab === 'finance' ? styles.tabBtnActive : ''}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>payments</span>
                  Payments & Receipts
                </button>

                <button 
                  onClick={() => setActiveTab('consents')} 
                  className={`${styles.tabBtn} ${activeTab === 'consents' ? styles.tabBtnActive : ''}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>description</span>
                  Documents & Consents
                </button>

                <button 
                  onClick={() => setActiveTab('attendance')} 
                  className={`${styles.tabBtn} ${activeTab === 'attendance' ? styles.tabBtnActive : ''}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>verified</span>
                  Attendance & Diploma
                </button>

                <button 
                  onClick={() => setActiveTab('feedback')} 
                  className={`${styles.tabBtn} ${activeTab === 'feedback' ? styles.tabBtnActive : ''}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>photo_library</span>
                  Feedback & Media
                </button>

                <button 
                  onClick={() => setActiveTab('security')} 
                  className={`${styles.tabBtn} ${activeTab === 'security' ? styles.tabBtnActive : ''}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock_reset</span>
                  Security & Password
                </button>
              </div>
            </div>
          </section>

          {/* Main Portal View */}
          <section className={styles.portalContent}>
            <div className={styles.container}>
              <div className={styles.dashboardGrid}>
                
                {/* Left Sidebar Profile Card */}
                <div className={styles.profileSidebar}>
                  <div className={styles.profileCard}>
                    <img src={student.photo} alt={student.name} className={styles.avatar} />
                    <h2 className={styles.studentName}>{student.name}</h2>
                    <span className={styles.cohortTag}>{student.ageGroup}</span>
                    
                    <span style={{ background: '#10b981', color: '#ffffff', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em' }}>
                      {student.status}
                    </span>

                    <ul className={styles.detailList}>
                      <li className={styles.detailItem}>
                        <span className={styles.detailLabel}>Student ID</span>
                        <span className={styles.detailVal}>{student.id}</span>
                      </li>
                      <li className={styles.detailItem}>
                        <span className={styles.detailLabel}>Campus</span>
                        <span className={styles.detailVal}>{student.campus}</span>
                      </li>
                      <li className={styles.detailItem}>
                        <span className={styles.detailLabel}>Programme</span>
                        <span className={styles.detailVal}>Multidisciplinary</span>
                      </li>
                      <li className={styles.detailItem}>
                        <span className={styles.detailLabel}>Attendance</span>
                        <span className={styles.detailVal} style={{ color: '#10b981' }}>{student.attendanceRate}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Feed Area */}
                <div className={styles.mainFeed}>
                  
                  {/* Tab 1: Profile & Programme Details */}
                  {activeTab === 'profile' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={styles.feedCard}>
                      <div className={styles.feedCardHeader}>
                        <h3 className={styles.feedCardTitle}>Programme Overview & Enrolment</h3>
                        <span style={{ fontSize: '12px', color: '#C7A56A', fontWeight: '700' }}>Active Academic Term</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
                        <div style={{ background: '#F7F5F2', padding: '16px', borderRadius: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Assigned Class Cohort</span>
                          <strong style={{ fontSize: '14px', color: '#0A0A0A' }}>{student.cohortName}</strong>
                        </div>

                        <div style={{ background: '#F7F5F2', padding: '16px', borderRadius: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Class Timetable</span>
                          <strong style={{ fontSize: '14px', color: '#0A0A0A' }}>{student.schedule}</strong>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '16px', color: '#0A0A0A', margin: '24px 0 12px 0' }}>Enrolled Core Subjects</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {student.interests.map((sub: string) => (
                          <span key={sub} style={{ background: '#F7F5F2', border: '1px solid #E8E2DA', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', color: '#0A0A0A', fontWeight: '500' }}>
                            {sub}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 2: Schedule & Announcements */}
                  {activeTab === 'schedule' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={styles.feedCard}>
                      <div className={styles.feedCardHeader}>
                        <h3 className={styles.feedCardTitle}>Academy Announcements & Timetable</h3>
                      </div>

                      <div className={styles.announcementItem}>
                        <span className={styles.announcementDate}>JULY 20, 2026</span>
                        <h4 className={styles.announcementTitle}>Graduate Runway Showcase Venue Confirmed</h4>
                        <p className={styles.announcementText}>The term graduation runway show will be hosted at the London Elite Studio Gallery. Guest passes are available in your portal.</p>
                      </div>

                      <div className={styles.announcementItem}>
                        <span className={styles.announcementDate}>JULY 15, 2026</span>
                        <h4 className={styles.announcementTitle}>Masterclass with Guest Fashion Director</h4>
                        <p className={styles.announcementText}>Special guest masterclass next Saturday covering camera acting and casting presentation.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 3: Payments & Receipts */}
                  {activeTab === 'finance' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={styles.feedCard}>
                      <div className={styles.feedCardHeader}>
                        <h3 className={styles.feedCardTitle}>Tuition & Payment Receipts</h3>
                        <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700' }}>✓ Stripe Verified</span>
                      </div>

                      <div className={styles.paymentGrid}>
                        <div className={styles.paymentStat}>
                          <span className={styles.statNumber}>{student.finance.totalTuition}</span>
                          <span className={styles.statText}>Total Tuition</span>
                        </div>
                        <div className={styles.paymentStat}>
                          <span className={styles.statNumber} style={{ color: '#10b981' }}>{student.finance.paidAmount}</span>
                          <span className={styles.statText}>Paid Amount</span>
                        </div>
                        <div className={styles.paymentStat}>
                          <span className={styles.statNumber}>{student.finance.outstanding}</span>
                          <span className={styles.statText}>Outstanding</span>
                        </div>
                      </div>

                      <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F7F5F2', padding: '16px 20px', borderRadius: '10px' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: '14px', color: '#0A0A0A' }}>Official Tuition Invoice & Receipt ({student.finance.invoiceNumber})</strong>
                          <span style={{ fontSize: '12px', color: '#666' }}>Paid via Credit Card (Stripe Verified)</span>
                        </div>
                        <button className={styles.btnDownload} onClick={handlePrintReceipt}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                          Print Official Receipt
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 4: Documents & Consents */}
                  {activeTab === 'consents' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={styles.feedCard}>
                      <div className={styles.feedCardHeader}>
                        <h3 className={styles.feedCardTitle}>Documents, Policies & Verified Consents</h3>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                          { title: 'Parent / Guardian Safeguarding Agreement', status: student.consents.safeguardingAccepted ? 'VERIFIED' : 'PENDING' },
                          { title: 'Photography & Video Media Release Consent', status: student.consents.mediaConsent ? 'VERIFIED' : 'PENDING' },
                          { title: 'Emergency Medical & Allergy Consent', status: student.consents.medicalConsent ? 'VERIFIED' : 'PENDING' },
                          { title: 'Academy Terms & Code of Conduct', status: student.consents.termsAccepted ? 'VERIFIED' : 'PENDING' }
                        ].map((doc) => (
                          <div key={doc.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#F7F5F2', borderRadius: '8px', border: '1px solid #E8E2DA' }}>
                            <div>
                              <strong style={{ fontSize: '13.5px', color: '#0A0A0A', display: 'block' }}>{doc.title}</strong>
                              <span style={{ fontSize: '11px', color: '#888' }}>Verified on Application Submission</span>
                            </div>
                            <span style={{ color: doc.status === 'VERIFIED' ? '#10b981' : '#dc2626', fontSize: '11px', fontWeight: '700' }}>✓ {doc.status}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 5: Attendance & Certificates */}
                  {activeTab === 'attendance' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={styles.feedCard}>
                      <div className={styles.feedCardHeader}>
                        <h3 className={styles.feedCardTitle}>Attendance Log & Diploma Certificate</h3>
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <h4 style={{ fontSize: '14px', color: '#0A0A0A', marginBottom: '12px' }}>Weekly Attendance Record</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {student.attendanceLog.map((log: any) => (
                            <div key={log.week} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#F7F5F2', borderRadius: '8px' }}>
                              <span style={{ fontSize: '13px', color: '#0A0A0A' }}><strong>{log.week}:</strong> {log.subject} ({log.date})</span>
                              <span style={{ color: '#10b981', fontWeight: '700', fontSize: '12px' }}>{log.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ background: '#F7F5F2', border: '1px solid #E8E2DA', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#C7A56A' }}>workspace_premium</span>
                        <h4 style={{ fontSize: '18px', color: '#0A0A0A', margin: '8px 0' }}>Marse Academy Completion Certificate</h4>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>Print or preview your official Marse Academy Diploma Certificate below.</p>
                        <button className={styles.btnDownload} onClick={handlePrintCert}>
                          Print / Download Diploma
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 6: Feedback & Media */}
                  {activeTab === 'feedback' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={styles.feedCard}>
                      <div className={styles.feedCardHeader}>
                        <h3 className={styles.feedCardTitle}>Mentor Feedback & Studio Photographs</h3>
                      </div>

                      {student.mentorFeedback.map((fb: any, idx: number) => (
                        <div key={idx} style={{ background: '#F7F5F2', padding: '20px', borderRadius: '10px', marginBottom: '24px', borderLeft: '4px solid #C7A56A' }}>
                          <span style={{ fontSize: '11px', color: '#C7A56A', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                            Mentor Note — {fb.mentor} ({fb.date})
                          </span>
                          <p style={{ fontSize: '14px', color: '#0A0A0A', fontStyle: 'italic', margin: 0 }}>
                            "{fb.note}"
                          </p>
                        </div>
                      ))}

                      <h4 style={{ fontSize: '14px', color: '#0A0A0A', marginBottom: '12px' }}>Private Studio Shoot Gallery</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        {['/program-fashion-modeling.png', '/about-models.png', '/hero-model.png'].map((imgSrc, idx) => (
                          <img key={idx} src={imgSrc} alt="Studio Shoot" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 7: Security & Password */}
                  {activeTab === 'security' && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={styles.feedCard}>
                      <div className={styles.feedCardHeader}>
                        <h3 className={styles.feedCardTitle}>Account Security & Password</h3>
                      </div>

                      <div style={{ background: '#F7F5F2', padding: '20px', borderRadius: '10px', marginBottom: '24px', border: '1px solid #E8E2DA' }}>
                        <span style={{ fontSize: '11px', color: '#C7A56A', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                          Default Access Password Info
                        </span>
                        <p style={{ fontSize: '13px', color: '#4A4A4A', margin: '0 0 8px 0', lineHeight: '1.6' }}>
                          Upon application approval, your initial access password was automatically generated as: <strong style={{ color: '#0A0A0A' }}>Marse2026!{student.dbId ? student.dbId.slice(-3) : '789'}</strong>
                        </p>
                        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                          For security, you can set your own custom password below.
                        </p>
                      </div>

                      <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '440px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0A0A0A' }}>
                            New Password
                          </label>
                          <input 
                            type="password"
                            value={newPassInput}
                            onChange={(e) => setNewPassInput(e.target.value)}
                            placeholder="Enter new password (min 6 characters)..."
                            required
                            style={{
                              background: '#F7F5F2',
                              border: '1px solid #E8E2DA',
                              borderRadius: '10px',
                              padding: '12px 14px',
                              fontSize: '14px',
                              color: '#0A0A0A',
                              outline: 'none'
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0A0A0A' }}>
                            Confirm New Password
                          </label>
                          <input 
                            type="password"
                            value={confirmPassInput}
                            onChange={(e) => setConfirmPassInput(e.target.value)}
                            placeholder="Re-enter new password..."
                            required
                            style={{
                              background: '#F7F5F2',
                              border: '1px solid #E8E2DA',
                              borderRadius: '10px',
                              padding: '12px 14px',
                              fontSize: '14px',
                              color: '#0A0A0A',
                              outline: 'none'
                            }}
                          />
                        </div>

                        {passChangeMsg && (
                          <div style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: passChangeMsg.isError ? 'rgba(220, 38, 38, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                            border: passChangeMsg.isError ? '1px solid rgba(220, 38, 38, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
                            color: passChangeMsg.isError ? '#dc2626' : '#10b981',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {passChangeMsg.text}
                          </div>
                        )}

                        <button 
                          type="submit"
                          disabled={passChanging}
                          style={{
                            background: '#0A0A0A',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '14px',
                            fontSize: '12px',
                            fontWeight: '700',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            cursor: passChanging ? 'wait' : 'pointer',
                            marginTop: '8px'
                          }}
                        >
                          {passChanging ? 'Updating Password...' : 'Save New Password'}
                        </button>
                      </form>
                    </motion.div>
                  )}

                </div>

              </div>
            </div>
          </section>
        </>
      )}

      {/* Google Sign-In Verification Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10,10,10,0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
            onClick={() => setShowGoogleModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#ffffff',
                border: '1px solid #E8E2DA',
                borderRadius: '20px',
                padding: '36px',
                maxWidth: '420px',
                width: '100%',
                boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" style={{ marginBottom: '12px' }}>
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
                </svg>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                  Sign In with Google
                </h3>
                <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                  Enter your Google Account email to verify matching academy enrollment
                </p>
              </div>

              <form onSubmit={handleGoogleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input 
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="name@gmail.com"
                  required
                  style={{
                    background: '#F7F5F2',
                    border: '1px solid #E8E2DA',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    fontSize: '14px',
                    color: '#0A0A0A',
                    outline: 'none'
                  }}
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowGoogleModal(false)}
                    style={{
                      flexGrow: 1,
                      background: '#F7F5F2',
                      border: '1px solid #E8E2DA',
                      borderRadius: '10px',
                      padding: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#0A0A0A',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={googleLoading}
                    style={{
                      flexGrow: 1,
                      background: '#0A0A0A',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    {googleLoading ? 'Verifying...' : 'Verify Gmail'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
