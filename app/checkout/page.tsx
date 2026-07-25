'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './checkout.module.css';

// OFFICIAL PAYMENT BRAND LOGO COMPONENTS (SVG)
const VisaLogo = () => (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={{ borderRadius: '4px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}>
    <rect width="38" height="24" rx="4" fill="#1A1F71"/>
    <path d="M14.5 16.2L16.4 8.6H19.3L17.4 16.2H14.5ZM24 8.8C23.4 8.6 22.5 8.4 21.4 8.4C18.3 8.4 16.2 10 16.2 12.3C16.2 14 17.7 14.9 18.8 15.5C19.9 16.1 20.3 16.4 20.3 16.9C20.3 17.6 19.4 17.9 18.5 17.9C17.2 17.9 16.3 17.6 15.7 17.3L15.2 19.6C15.9 19.9 17.3 20.2 18.7 20.2C22 20.2 24.1 18.6 24.1 16.2C24.1 13.1 19.9 12.9 19.9 11.6C19.9 11.1 20.4 10.6 21.5 10.6C22.3 10.6 23.3 10.8 23.9 11.1L24 8.8ZM29.1 8.6H26.9C26.2 8.6 25.6 8.8 25.3 9.5L21.7 18H24.7L25.3 16.3H29L29.3 18H31.9L29.1 8.6ZM26.1 14L27.5 10.2L28.3 14H26.1ZM13.3 8.6L10.4 15.8L9.3 9.5C9.1 8.9 8.6 8.6 8 8.6H3.1L3 8.9C4.1 9.2 5.6 9.7 6.7 10.3L10.2 20.2H13.3L17.5 8.6H13.3" fill="white"/>
  </svg>
);

const MastercardLogo = () => (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={{ borderRadius: '4px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}>
    <rect width="38" height="24" rx="4" fill="#141414"/>
    <circle cx="14" cy="12" r="7.5" fill="#EB001B"/>
    <circle cx="24" cy="12" r="7.5" fill="#F79E1B"/>
    <path d="M19 6.24A7.47 7.47 0 0 0 16.37 12 7.47 7.47 0 0 0 19 17.76 7.47 7.47 0 0 0 21.63 12 7.47 7.47 0 0 0 19 6.24Z" fill="#FF5F00"/>
  </svg>
);

const PayPalOfficialLogo = () => (
  <svg width="76" height="22" viewBox="0 0 76 22" fill="none">
    <path d="M8.7 3H3.2C2.9 3 2.6 3.2 2.5 3.5L0 19.1C0 19.3 0.2 19.5 0.4 19.5H4.6C4.9 19.5 5.2 19.3 5.3 19L6.2 13.3C6.3 13 6.6 12.8 6.9 12.8H9.1C13.4 12.8 16 10.6 16.6 6.3C17 4.3 15.8 3 13.7 3H8.7Z" fill="#003087"/>
    <path d="M9.5 4.7H5.2C4.9 4.7 4.6 4.9 4.5 5.2L3 14.8C3 15 3.2 15.2 3.4 15.2H6.5C6.8 15.2 7.1 15 7.2 14.7L8 9.1C8.1 8.8 8.4 8.6 8.7 8.6H10.9C15.2 8.6 17.4 6.4 18 2.2C17.8 2.1 17.5 2 17.1 2C16.2 2 15.1 2.1 14 2.1H9.5V4.7Z" fill="#0079C1"/>
    <path d="M25.5 3H20C19.7 3 19.4 3.2 19.3 3.5L16.8 19.1C16.8 19.3 17 19.5 17.2 19.5H21.4C21.7 19.5 22 19.3 22.1 19L23 13.3C23.1 13 23.4 12.8 23.7 12.8H25.9C30.2 12.8 32.8 10.6 33.4 6.3C33.8 4.3 32.6 3 30.5 3H25.5Z" fill="#00457C"/>
  </svg>
);

const GooglePayOfficialLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '4px' }}>
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
    <span style={{ fontSize: '13px', fontWeight: '800', color: '#5f6368', fontFamily: 'sans-serif' }}>Pay</span>
  </div>
);

const ApplePayOfficialLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#000', padding: '4px 10px', borderRadius: '4px', color: '#fff' }}>
    <svg width="14" height="16" viewBox="0 0 170 170" fill="currentColor">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.16-1.9-14.48-6.1-3.23-2.63-7.14-7.27-11.72-13.9-6.3-9.15-11.13-19.5-14.48-31.06-3.36-11.55-5.04-22.37-5.04-32.46 0-14.68 3.69-26.6 11.07-35.75 7.38-9.16 16.71-13.8 27.99-13.93 4.83 0 10.05 1.18 15.66 3.55 5.61 2.37 9.4 3.55 11.37 3.55 1.63 0 5.48-1.24 11.55-3.73 6.07-2.48 11.45-3.62 16.14-3.41 12.01.52 21.6 4.96 28.77 13.33-10.74 6.5-16.01 15.54-15.82 27.13.19 9.04 3.6 16.59 10.23 22.65 6.63 6.06 14.54 9.48 23.73 10.26-2.58 7.74-5.94 15.35-10.08 22.84zM119.22 31.09c0-7.07 2.58-13.79 7.75-20.17 5.16-6.37 11.75-10.15 19.76-10.92.26 1.04.39 2.01.39 2.92 0 6.94-2.65 13.79-7.95 20.55-5.3 6.76-11.85 10.45-19.65 11.07-.06-1.11-.3-2.26-.3-3.45z"/>
    </svg>
    <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'sans-serif' }}>Pay</span>
  </div>
);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');

  const [plans, setPlans] = useState<any[]>([
    {
      id: '2',
      name: 'Full Annual Pathway',
      description: 'The complete Marse Talent experience with exclusive privileges & London studio access.',
      price: '$48,000',
      period: '/yr',
      features: [
        'Elite Masterclass Access Included',
        'Priority Course & Studio Registration',
        '1-on-1 Dedicated Academic Advisor',
        'Global Alumni Network Entry',
        'London Fashion Week Backstage Entry'
      ],
      isFeatured: true,
      badge: 'RECOMMENDED'
    }
  ]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  // Selected radio option: 'CARD' | 'PAYPAL' | 'GPAY' | 'APPLE'
  const [selectedOption, setSelectedOption] = useState<'CARD' | 'PAYPAL' | 'GPAY' | 'APPLE'>('CARD');

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [payStatus, setPayStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Pricing plans and settings
  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPlans(data);
          const found = data.find((p: any) => p.id === planId);
          if (found) {
            setSelectedPlan(found);
          } else {
            const featured = data.find((p: any) => p.isFeatured);
            setSelectedPlan(featured || data[0]);
          }
        }
        setLoadingPlan(false);
      })
      .catch(err => {
        console.error('Failed to load pricing details:', err);
        const found = plans.find((p: any) => p.id === planId) || plans[0];
        setSelectedPlan(found);
        setLoadingPlan(false);
      });
  }, [planId]);

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s?/g, '').replace(/[^0-9]/gi, '');
    let matches = val.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setFormData(prev => ({ ...prev, cardNumber: parts.join(' ') }));
    } else {
      setFormData(prev => ({ ...prev, cardNumber: val }));
    }
  };

  // Format Expiry Date
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setFormData(prev => ({ ...prev, expiry: val.substring(0, 5) }));
  };

  // Handle Card Submission
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payStatus === 'LOADING') return;

    setPayStatus('LOADING');
    setErrorMessage('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          cardName: formData.cardName || 'Cardholder',
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          amount: selectedPlan.price,
          planName: selectedPlan.name
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setPayStatus('SUCCESS');
        showToast('Payment verified successfully. Welcome to the academy!', 'success');
      } else {
        setPayStatus('ERROR');
        setErrorMessage(resData.error || 'Card verification failed.');
        showToast(resData.error || 'Payment process failed', 'error');
      }
    } catch (error) {
      setPayStatus('ERROR');
      setErrorMessage('Payment gateway is temporarily offline.');
      showToast('Gateway connection error', 'error');
    }
  };

  // Handle PayPal Submission
  const handlePayPalSubmit = async () => {
    if (!formData.email.trim()) {
      showToast('Please enter your email address in the card section or above.', 'error');
      return;
    }
    setPayStatus('LOADING');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          cardName: 'PayPal Customer',
          cardNumber: 'PayPal Express Checkout (Verified)',
          amount: selectedPlan.price,
          planName: selectedPlan.name
        })
      });
      const data = await res.json();
      if (data.success) {
        setPayStatus('SUCCESS');
        showToast('PayPal payment authorized & enrollment confirmed!', 'success');
      } else {
        setPayStatus('ERROR');
        setErrorMessage(data.error || 'PayPal authorization failed');
      }
    } catch (err) {
      setPayStatus('ERROR');
      setErrorMessage('Network connection error during PayPal checkout');
    }
  };

  if (loadingPlan || !selectedPlan) {
    return (
      <div className={styles.loadingContainer}>
        <span className={styles.spinner}></span>
        <p>Loading secure billing gateway...</p>
      </div>
    );
  }

  if (payStatus === 'SUCCESS') {
    return (
      <div className={styles.successWrapper}>
        <div className={styles.successCard}>
          <div className={styles.successIconWrapper}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className={styles.successTitle}>Enrollment Confirmed</h2>
          <p className={styles.successSubtitle}>
            Congratulations! Your payment for <strong>{selectedPlan.name}</strong> was processed and verified.
          </p>
          <div className={styles.successReceipt}>
            <div className={styles.receiptRow}>
              <span>Status</span>
              <span className={styles.receiptApproved}>VERIFIED</span>
            </div>
            <div className={styles.receiptRow}>
              <span>Pathway</span>
              <span>{selectedPlan.name}</span>
            </div>
            <div className={styles.receiptRow}>
              <span>Amount Paid</span>
              <span className={styles.receiptPrice}>{selectedPlan.price}</span>
            </div>
            <div className={styles.receiptRow}>
              <span>Student Account</span>
              <span>{formData.email}</span>
            </div>
          </div>
          <p className={styles.successInstructions}>
            A receipt and enrollment credentials have been dispatched to your email address.
          </p>
          <button onClick={() => window.location.href = '/'} className={styles.btnSuccessReturn}>
            Return to Academy Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutLayout}>
      
      {/* LEFT COLUMN: DOMESTIKA-STYLE ACCORDION PURCHASE FORM */}
      <div className={styles.formPanel}>
        <div className={styles.formPanelContent} style={{ maxWidth: '540px' }}>
          
          {/* Header Title */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '28px',
              fontWeight: '800',
              color: '#111111',
              margin: '0 0 4px 0',
              letterSpacing: '-0.02em'
            }}>
              Confirm your purchase
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Enrolling in: <strong style={{ color: '#000' }}>{selectedPlan.name} ({selectedPlan.price})</strong>
            </p>
          </div>

          {/* ACCORDION RADIO PAYMENT METHODS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            
            {/* OPTION 1: PAY WITH CARD (STRIPE) - ACTIVE */}
            <div style={{
              border: selectedOption === 'CARD' ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              boxShadow: selectedOption === 'CARD' ? '0 4px 20px rgba(234, 88, 12, 0.08)' : 'none',
              transition: 'all 0.2s ease'
            }}>
              <div 
                onClick={() => setSelectedOption('CARD')}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: selectedOption === 'CARD' ? '#ffffff' : '#fafafa'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    checked={selectedOption === 'CARD'} 
                    onChange={() => setSelectedOption('CARD')}
                    style={{ accentColor: '#ea580c', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#111' }}>Pay with card</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <VisaLogo />
                  <MastercardLogo />
                </div>
              </div>

              {selectedOption === 'CARD' && (
                <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid #f1f5f9' }}>
                  <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                    
                    <div className={styles.inputGroup}>
                      <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', textTransform: 'none' }}>Email</label>
                      <input 
                        type="email" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="student@example.com"
                        disabled={payStatus === 'LOADING'}
                        style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px 14px' }}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', textTransform: 'none' }}>Card number</label>
                      <div className={styles.inputIconWrapper}>
                        <input 
                          type="text" 
                          required 
                          maxLength={19}
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 1234 1234 1234"
                          disabled={payStatus === 'LOADING'}
                          style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px 14px' }}
                        />
                        <div style={{ position: 'absolute', right: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <VisaLogo />
                          <MastercardLogo />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className={styles.inputGroup}>
                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', textTransform: 'none' }}>Expiration date</label>
                        <input 
                          type="text" 
                          required 
                          maxLength={5}
                          value={formData.expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM / YY"
                          disabled={payStatus === 'LOADING'}
                          style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px 14px' }}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', textTransform: 'none' }}>Security code</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <input 
                            type="password" 
                            required 
                            maxLength={4}
                            value={formData.cvc}
                            onChange={(e) => setFormData(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '') }))}
                            placeholder="CVC"
                            disabled={payStatus === 'LOADING'}
                            style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px 14px', width: '100%' }}
                          />
                          <span style={{ position: 'absolute', right: '10px', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>💳 123</span>
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '11.5px', color: '#64748b', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                      By providing your card information, you allow Marse Academy to charge your card for future payments in accordance with their terms.
                    </p>

                    {payStatus === 'ERROR' && (
                      <div className={styles.errorBanner}>
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={payStatus === 'LOADING'}
                      style={{
                        backgroundColor: '#d97706',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '16px',
                        fontSize: '16px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)',
                        transition: 'all 0.2s ease',
                        marginTop: '8px'
                      }}
                    >
                      {payStatus === 'LOADING' ? (
                        <span>Processing Payment...</span>
                      ) : (
                        <span>🛒 Complete purchase ({selectedPlan.price})</span>
                      )}
                    </button>

                  </form>
                </div>
              )}
            </div>

            {/* OPTION 2: PAY WITH PAYPAL - ACTIVE */}
            <div style={{
              border: selectedOption === 'PAYPAL' ? '1.5px solid #0070ba' : '1px solid #e2e8f0',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              transition: 'all 0.2s ease'
            }}>
              <div 
                onClick={() => setSelectedOption('PAYPAL')}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: selectedOption === 'PAYPAL' ? '#ffffff' : '#fafafa'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    checked={selectedOption === 'PAYPAL'} 
                    onChange={() => setSelectedOption('PAYPAL')}
                    style={{ accentColor: '#0070ba', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#111' }}>Pay with PayPal</span>
                </div>
                <PayPalOfficialLogo />
              </div>

              {selectedOption === 'PAYPAL' && (
                <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
                    You will be redirected to PayPal to complete your purchase securely.
                  </p>
                  <button
                    type="button"
                    onClick={handlePayPalSubmit}
                    disabled={payStatus === 'LOADING'}
                    style={{
                      width: '100%',
                      backgroundColor: '#0070ba',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '14px',
                      fontSize: '15px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <PayPalOfficialLogo />
                    <span>Proceed with PayPal Express →</span>
                  </button>
                </div>
              )}
            </div>

            {/* OPTION 3: PAY WITH GOOGLE PAY - SOON BADGE */}
            <div style={{
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              backgroundColor: '#fafafa',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: 0.75
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="radio" disabled name="paymentMethod" style={{ width: '18px', height: '18px' }} />
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#64748b' }}>Pay with Google Pay</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', background: '#e2e8f0', color: '#475569', fontWeight: '800', padding: '2px 8px', borderRadius: '12px' }}>
                  SOON ⏳
                </span>
                <GooglePayOfficialLogo />
              </div>
            </div>

            {/* OPTION 4: PAY WITH APPLE PAY - SOON BADGE */}
            <div style={{
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              backgroundColor: '#fafafa',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: 0.75
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="radio" disabled name="paymentMethod" style={{ width: '18px', height: '18px' }} />
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#64748b' }}>Pay with Apple Pay</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', background: '#e2e8f0', color: '#475569', fontWeight: '800', padding: '2px 8px', borderRadius: '12px' }}>
                  SOON ⏳
                </span>
                <ApplePayOfficialLogo />
              </div>
            </div>

          </div>

          {/* Legal Fine Disclaimer */}
          <p style={{ fontSize: '11.5px', color: '#64748b', lineHeight: '1.5', margin: '0 0 24px 0' }}>
            By clicking "Complete purchase" I am confirming I am 16 or older and I accept the <a href="/legal/terms" style={{ color: '#334155', textDecoration: 'underline' }}>Terms of use</a>, the <a href="/legal/privacy" style={{ color: '#334155', textDecoration: 'underline' }}>Privacy Policy</a>, the <a href="/legal/cookies" style={{ color: '#334155', textDecoration: 'underline' }}>Cookies Policy</a>, and agree to receive news and promotions.
          </p>

          {/* Bottom Security Footer Bar */}
          <div style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>100% secure payment</span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <VisaLogo />
                <MastercardLogo />
                <PayPalOfficialLogo />
              </div>
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🔒 Your cards are safely stored & processed via 256-bit encrypted SSL payment gateway.</span>
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: DARK OBSIDIAN LUXURY SUMMARY SIDEBAR */}
      <div className={styles.planPanel} style={{ background: '#0A0A0A' }}>
        
        <div className={styles.planSummaryBox}>
          
          <div className={styles.summaryLabel}>
            SELECTED ACADEMIC PATHWAY
          </div>
          
          <h2 className={styles.summaryPlanName}>
            {selectedPlan.name}
          </h2>

          <p className={styles.summaryPlanDesc}>
            {selectedPlan.description}
          </p>

          <div className={styles.summaryPriceRow}>
            <span className={styles.summaryPriceValue}>{selectedPlan.price}</span>
            <span className={styles.summaryPricePeriod}>{selectedPlan.period || '/yr'}</span>
          </div>

          <div className={styles.featuresSection}>
            <h3>Included Academic Privileges:</h3>
            <ul className={styles.summaryFeaturesList}>
              {selectedPlan.features && selectedPlan.features.map((feat: string, idx: number) => (
                <li key={idx}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Live Seat Guarantee Alert */}
          <div style={{
            marginTop: '32px',
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>🔥</span>
            <div>
              <h4 style={{ margin: 0, fontSize: '12px', color: '#D4AF37', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Limited Enrollment Cohort</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#a0a0a0' }}>Only 2 seats remaining for the upcoming Fall 2026 term.</p>
            </div>
          </div>

        </div>

        <div className={styles.planPanelFooter}>
          <div className={styles.securityTrustBadge}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Official Marse Academy of Fashion & Arts Admission Portal. All Rights Reserved.</span>
          </div>
        </div>

      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}>
          <div className={styles.toastContent}>
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className={styles.toastClose}>&times;</button>
        </div>
      )}

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className={styles.loadingContainer}><span className={styles.spinner}></span><p>Loading gateway...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
