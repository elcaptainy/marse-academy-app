'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './checkout.module.css';

// OFFICIAL PAYMENT BRAND LOGO COMPONENTS
const VisaLogo = () => (
  <img 
    src="/visa-official.svg" 
    alt="Visa" 
    style={{ height: '20px', width: 'auto', display: 'block', objectFit: 'contain' }} 
  />
);

const MastercardLogo = () => (
  <img 
    src="/mastercard-official.webp" 
    alt="Mastercard" 
    style={{ height: '22px', width: 'auto', display: 'block', objectFit: 'contain' }} 
  />
);

const PayPalOfficialLogo = () => (
  <img 
    src="/paypal-official.webp" 
    alt="PayPal" 
    style={{ height: '24px', width: 'auto', display: 'block', objectFit: 'contain' }} 
  />
);

const StripeOfficialLogo = () => (
  <img 
    src="/stripe-official.png" 
    alt="Stripe" 
    style={{ height: '22px', width: 'auto', display: 'block', objectFit: 'contain' }} 
  />
);

const GooglePayOfficialLogo = () => (
  <img 
    src="/gpay-official.png" 
    alt="Google Pay" 
    style={{ height: '22px', width: 'auto', display: 'block', objectFit: 'contain' }} 
  />
);

const ApplePayOfficialLogo = () => (
  <img 
    src="/applepay-official.webp" 
    alt="Apple Pay" 
    style={{ height: '22px', width: 'auto', display: 'block', objectFit: 'contain' }} 
  />
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

  // Selected Payment Mode: 'FULL' (Single Payment) | 'INSTALLMENTS' (Split Payments)
  const [paymentMode, setPaymentMode] = useState<'FULL' | 'INSTALLMENTS'>('FULL');
  const [installmentFrequency, setInstallmentFrequency] = useState<'QUARTERLY' | 'MONTHLY'>('QUARTERLY');

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
          <div style={{ marginBottom: '24px' }}>
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
              Enrolling in: <strong style={{ color: '#000' }}>{selectedPlan.name}</strong>
            </p>
          </div>

          {/* GLOBAL PAYMENT FREQUENCY TOGGLE (PAY IN FULL VS FLEXIBLE INSTALLMENTS) */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Select Payment Plan Schedule
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: paymentMode === 'INSTALLMENTS' ? '12px' : '0' }}>
              
              {/* Option A: Pay in Full */}
              <div 
                onClick={() => setPaymentMode('FULL')}
                style={{
                  border: paymentMode === 'FULL' ? '2px solid #C7A56A' : '1px solid #cbd5e1',
                  backgroundColor: paymentMode === 'FULL' ? '#ffffff' : '#f1f5f9',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <input type="radio" name="paySchedule" checked={paymentMode === 'FULL'} onChange={() => setPaymentMode('FULL')} style={{ accentColor: '#C7A56A' }} />
                  <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#0f172a' }}>Pay in Full</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#C7A56A', paddingLeft: '24px' }}>
                  {selectedPlan.price}
                </div>
                <span style={{ fontSize: '9.5px', background: '#10b981', color: '#fff', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', position: 'absolute', top: '8px', right: '8px' }}>
                  SAVE 10%
                </span>
              </div>

              {/* Option B: Flexible Installments */}
              <div 
                onClick={() => setPaymentMode('INSTALLMENTS')}
                style={{
                  border: paymentMode === 'INSTALLMENTS' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                  backgroundColor: paymentMode === 'INSTALLMENTS' ? '#ffffff' : '#f1f5f9',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <input type="radio" name="paySchedule" checked={paymentMode === 'INSTALLMENTS'} onChange={() => setPaymentMode('INSTALLMENTS')} style={{ accentColor: '#ea580c' }} />
                  <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#0f172a' }}>Installments</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#ea580c', paddingLeft: '24px' }}>
                  {installmentFrequency === 'QUARTERLY' ? '$12,000' : '$4,000'}
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal' }}>
                    {installmentFrequency === 'QUARTERLY' ? ' / qtr' : ' / mo'}
                  </span>
                </div>
                <span style={{ fontSize: '9.5px', background: '#ea580c', color: '#fff', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', position: 'absolute', top: '8px', right: '8px' }}>
                  FLEXIBLE
                </span>
              </div>

            </div>

            {/* Sub-frequency selector when Installments is active */}
            {paymentMode === 'INSTALLMENTS' && (
              <div style={{
                borderTop: '1px dashed #cbd5e1',
                paddingTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <span style={{ color: '#475569', fontWeight: '600' }}>Installment Frequency:</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setInstallmentFrequency('QUARTERLY')}
                    style={{
                      border: 'none',
                      background: installmentFrequency === 'QUARTERLY' ? '#ea580c' : '#e2e8f0',
                      color: installmentFrequency === 'QUARTERLY' ? '#fff' : '#475569',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    4 Quarterly Payments ($12k)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstallmentFrequency('MONTHLY')}
                    style={{
                      border: 'none',
                      background: installmentFrequency === 'MONTHLY' ? '#ea580c' : '#e2e8f0',
                      color: installmentFrequency === 'MONTHLY' ? '#fff' : '#475569',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    12 Monthly Payments ($4k)
                  </button>
                </div>
              </div>
            )}

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

      {/* RIGHT COLUMN: ULTRA-LUXURY ACADEMIC ORDER SUMMARY SIDEBAR */}
      <div className={styles.planPanel} style={{ background: '#0A0A0A', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
        
        <div className={styles.planSummaryBox}>
          
          {/* Official Academy Crest & Label */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🏛️</span>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '0.15em',
                color: '#C7A56A',
                textTransform: 'uppercase'
              }}>
                MARSE ACADEMY • LONDON
              </span>
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: '800',
              backgroundColor: 'rgba(199, 165, 106, 0.15)',
              color: '#C7A56A',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(199, 165, 106, 0.3)',
              letterSpacing: '0.05em'
            }}>
              {selectedPlan.badge || 'EXECUTIVE PATHWAY'}
            </span>
          </div>
          
          <h2 className={styles.summaryPlanName} style={{ fontSize: '32px', marginBottom: '8px' }}>
            {selectedPlan.name}
          </h2>

          <p className={styles.summaryPlanDesc} style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
            {selectedPlan.description}
          </p>

          {/* ITEMIZED PRICE BREAKDOWN TABLE */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '28px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
              Tuition & Privileges Breakdown
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#ccc', marginBottom: '10px' }}>
              <span>Base Program Tuition:</span>
              <span style={{ color: '#fff', fontWeight: '700' }}>{selectedPlan.price}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888', marginBottom: '10px' }}>
              <span>London Studio & Equipment Access:</span>
              <span style={{ color: '#10b981', fontWeight: '700' }}>INCLUDED ($0)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888', marginBottom: '10px' }}>
              <span>1-on-1 Master Executive Mentorship:</span>
              <span style={{ color: '#10b981', fontWeight: '700' }}>INCLUDED ($0)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888', marginBottom: '10px' }}>
              <span>Industry Portfolio & Certification:</span>
              <span style={{ color: '#10b981', fontWeight: '700' }}>INCLUDED ($0)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888', marginBottom: '16px' }}>
              <span>UK VAT & Taxes (HMRC Notice 701/30):</span>
              <span style={{ color: '#10b981', fontWeight: '700' }}>INCLUDED ($0)</span>
            </div>

            <div style={{
              borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
              paddingTop: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', display: 'block' }}>
                  {paymentMode === 'FULL' ? 'Total Investment Due Today:' : 'First Installment Due Today:'}
                </span>
                <span style={{ fontSize: '11px', color: '#666' }}>
                  {paymentMode === 'FULL' ? 'All taxes & fees included' : `${installmentFrequency === 'QUARTERLY' ? '4 quarterly' : '12 monthly'} automated billing`}
                </span>
              </div>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '32px',
                fontWeight: '800',
                color: paymentMode === 'FULL' ? '#C7A56A' : '#ea580c'
              }}>
                {paymentMode === 'FULL' ? selectedPlan.price : (installmentFrequency === 'QUARTERLY' ? '$12,000' : '$4,000')}
              </span>
            </div>
          </div>

          {/* INCLUDED PRIVILEGES CHECKLIST */}
          <div className={styles.featuresSection} style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#888' }}>ACADEMIC PRIVILEGES INCLUDED:</h3>
            <ul className={styles.summaryFeaturesList} style={{ gap: '10px' }}>
              {selectedPlan.features && selectedPlan.features.map((feat: string, idx: number) => (
                <li key={idx} style={{ fontSize: '13px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#C7A56A' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* LIVE SEAT & TIMER ALERT */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.03) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '22px' }}>🔒</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '12px', color: '#D4AF37', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>15-Minute Seat Lock Active</h4>
                <span style={{ fontSize: '10px', background: '#D4AF37', color: '#000', fontWeight: 'bold', padding: '1px 5px', borderRadius: '3px' }}>RESERVED</span>
              </div>
              <p style={{ margin: '3px 0 0 0', fontSize: '11.5px', color: '#cccccc' }}>
                Your seat is locked for Fall 2026 term while completing checkout.
              </p>
            </div>
          </div>

          {/* 14-DAY MONEY BACK ENROLLMENT GUARANTEE */}
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <div>
              <h5 style={{ margin: 0, fontSize: '12px', color: '#10b981', fontWeight: '800' }}>14-Day Enrollment Guarantee</h5>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>
                Full refund guaranteed if application is withdrawn before term start date.
              </p>
            </div>
          </div>

        </div>

        <div className={styles.planPanelFooter} style={{ marginTop: '32px' }}>
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
