'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './checkout.module.css';

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

  const [paymentGateway, setPaymentGateway] = useState<'STRIPE' | 'EXPRESS' | 'PORTAL' | 'PAYPAL'>('STRIPE');

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

  // Fetch Pricing plans and settings logo
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

  // Handle Stripe Hosted Checkout (checkout.stripe.com)
  const handleStripeHostedCheckout = async () => {
    if (payStatus === 'LOADING') return;
    setPayStatus('LOADING');
    setErrorMessage('');
    showToast('Redirecting to official Stripe Checkout (checkout.stripe.com)...', 'success');
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: selectedPlan.name,
          amount: selectedPlan.price,
          email: formData.email,
          cardName: formData.cardName
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPayStatus('ERROR');
        setErrorMessage(data.error || 'Failed to initialize official Stripe Checkout');
        showToast(data.error || 'Failed to initialize official Stripe Checkout', 'error');
      }
    } catch (err) {
      setPayStatus('ERROR');
      setErrorMessage('Connection error to Stripe Checkout');
      showToast('Connection error to Stripe Checkout', 'error');
    }
  };

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
          cardName: formData.cardName,
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
              <span className={styles.receiptApproved}>STRIPE VERIFIED</span>
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
      
      {/* LEFT COLUMN (60%): ACADEMIC REGISTRATION & PAYMENT OPTIONS */}
      <div className={styles.formPanel}>
        <div className={styles.formPanelContent}>
          
          {/* Header Back & Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <button onClick={() => window.location.href = '/#enrollment'} className={styles.btnBack} style={{ color: '#666' }}>
              ← Return to Pathways
            </button>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.12em', color: '#C7A56A', textTransform: 'uppercase' }}>
              🔒 256-BIT SSL ENCRYPTED
            </span>
          </div>

          <h1 className={styles.portalTitle}>Complete Your Admission</h1>
          <p className={styles.portalSubtitle}>
            Enter your details below to finalize your registration for <strong style={{ color: '#000' }}>{selectedPlan.name}</strong>.
          </p>

          {/* PAYMENT METHOD SELECTOR TABS */}
          <div style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '24px'
          }}>
            <button 
              type="button"
              onClick={() => setPaymentGateway('STRIPE')}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: paymentGateway === 'STRIPE' ? '#ffffff' : 'transparent',
                color: paymentGateway === 'STRIPE' ? '#000000' : '#64748b',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: paymentGateway === 'STRIPE' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              💳 Card (Stripe)
            </button>

            <button 
              type="button"
              onClick={() => setPaymentGateway('EXPRESS')}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: paymentGateway === 'EXPRESS' ? '#000000' : 'transparent',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              🍏 Apple / Google Pay
            </button>

            <button 
              type="button"
              onClick={() => setPaymentGateway('PORTAL')}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: paymentGateway === 'PORTAL' ? '#635BFF' : 'transparent',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🌐 Stripe Portal
            </button>
          </div>

          {/* TAB 1: APPLE PAY / GOOGLE PAY EXPRESS */}
          {paymentGateway === 'EXPRESS' && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '800' }}>Instant 1-Click Express Checkout</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
                Pay instantly using your saved Apple Pay or Google Pay wallet.
              </p>

              <button
                type="button"
                onClick={handleStripeHostedCheckout}
                style={{
                  width: '100%',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                }}
              >
                <span> Pay with Apple Pay</span>
              </button>
            </div>
          )}

          {/* TAB 2: STRIPE HOSTED PORTAL */}
          {paymentGateway === 'PORTAL' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 91, 255, 0.08) 0%, rgba(99, 91, 255, 0.02) 100%)',
              border: '1px solid rgba(99, 91, 255, 0.25)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>🔒</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#000' }}>Official Stripe Hosted Checkout</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Redirect to checkout.stripe.com (Official SSL Security)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStripeHostedCheckout}
                style={{
                  width: '100%',
                  backgroundColor: '#635BFF',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(99, 91, 255, 0.3)'
                }}
              >
                <span>Proceed to checkout.stripe.com →</span>
              </button>
            </div>
          )}

          {/* TAB 3: STANDARD CREDIT/DEBIT CARD FORM */}
          {paymentGateway === 'STRIPE' && (
            <>
              {/* Interactive Credit Card Preview */}
              <div className={styles.creditCardWrapper}>
                <div className={styles.creditCard}>
                  <div className={styles.cardTopRow}>
                    <div className={styles.cardChip}></div>
                    <div className={styles.cardBrandLogo}>Marse Talent</div>
                  </div>
                  <div className={styles.cardNumberDisplay}>
                    {formData.cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className={styles.cardBottomRow}>
                    <div>
                      <div className={styles.cardLabel}>Cardholder</div>
                      <div className={styles.cardValue}>
                        {formData.cardName || 'YOUR FULL NAME'}
                      </div>
                    </div>
                    <div>
                      <div className={styles.cardLabel}>Expires</div>
                      <div className={styles.cardValue}>
                        {formData.expiry || 'MM/YY'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCheckoutSubmit} className={styles.checkoutForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Student Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="student@example.com"
                    disabled={payStatus === 'LOADING'}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="cardName">Cardholder Full Name</label>
                  <input 
                    type="text" 
                    id="cardName" 
                    required 
                    value={formData.cardName}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
                    placeholder="Full name as printed on card"
                    disabled={payStatus === 'LOADING'}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="cardNumber">Card Number</label>
                  <div className={styles.inputIconWrapper}>
                    <input 
                      type="text" 
                      id="cardNumber" 
                      required 
                      maxLength={19}
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242  4242  4242  4242"
                      disabled={payStatus === 'LOADING'}
                    />
                    <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="expiry">Expiration</label>
                    <input 
                      type="text" 
                      id="expiry" 
                      required 
                      maxLength={5}
                      value={formData.expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM / YY"
                      disabled={payStatus === 'LOADING'}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="cvc">Security Code (CVC)</label>
                    <input 
                      type="password" 
                      id="cvc" 
                      required 
                      maxLength={4}
                      value={formData.cvc}
                      onChange={(e) => setFormData(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '') }))}
                      placeholder="123"
                      disabled={payStatus === 'LOADING'}
                    />
                  </div>
                </div>

                {payStatus === 'ERROR' && (
                  <div className={styles.errorBanner}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className={styles.btnPay}
                  disabled={payStatus === 'LOADING'}
                >
                  {payStatus === 'LOADING' ? (
                    <>
                      <span className={styles.btnSpinner}></span>
                      <span>Processing Stripe Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize Payment ({selectedPlan.price})</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Trust Footer Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0',
            fontSize: '11px',
            color: '#64748b'
          }}>
            <span>🔒 Stripe PCI Certified</span>
            <span>•</span>
            <span>🛡️ 256-Bit SSL Encrypted</span>
            <span>•</span>
            <span>🏛️ Official London Registration</span>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN (40%): DARK OBSIDIAN LUXURY SUMMARY SIDEBAR */}
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
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>London Fashion Studio Equipment & Materials (<strong style={{ color: '#10b981' }}>INCLUDED</strong>)</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>1-on-1 Master Executive Mentorship (<strong style={{ color: '#10b981' }}>INCLUDED</strong>)</span>
              </li>
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
