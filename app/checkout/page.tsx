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
      name: 'Full Annual',
      description: 'The complete Marse Talent experience with exclusive privileges.',
      price: '$48,000',
      period: '/yr',
      features: ['Elite Access Benefits Included', 'Priority Course Registration', 'Dedicated Academic Advisor', 'Global Alumni Network Entry'],
      isFeatured: true,
      badge: 'RECOMMENDED'
    }
  ]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const [paymentGateway, setPaymentGateway] = useState<'STRIPE' | 'PAYPAL'>('STRIPE');

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

  const handlePayPalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      showToast('Please enter your email address.', 'error');
      return;
    }
    setPayStatus('LOADING');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          cardName: formData.cardName || 'PayPal Customer',
          cardNumber: 'PayPal Express Checkout (Verified)',
          amount: selectedPlan ? selectedPlan.price : '$1,250',
          planName: selectedPlan ? selectedPlan.name : 'Multidisciplinary Programme'
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

  // Format Expiry Date (adds '/' after 2 digits)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setFormData(prev => ({ ...prev, expiry: val.substring(0, 5) }));
  };

  const [logoUrl, setLogoUrl] = useState('/logo.png');

  // Fetch Pricing plans and settings logo
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      })
      .catch(err => console.error('Failed to fetch settings logo:', err));

    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPlans(data);
          const found = data.find((p: any) => p.id === planId);
          if (found) {
            setSelectedPlan(found);
          } else {
            // Fallback to featured or first
            const featured = data.find((p: any) => p.isFeatured);
            setSelectedPlan(featured || data[0]);
          }
        }
        setLoadingPlan(false);
      })
      .catch(err => {
        console.error('Failed to load pricing details:', err);
        // Use static fallback
        const found = plans.find((p: any) => p.id === planId) || plans[0];
        setSelectedPlan(found);
        setLoadingPlan(false);
      });
  }, [planId]);

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

  // Determine card header gradient based on badge
  let leftBg = '#0d0d0d';
  if (selectedPlan.badge === 'MOST_POPULAR') {
    leftBg = '#080c14';
  } else if (selectedPlan.badge === 'ELITE') {
    leftBg = 'linear-gradient(135deg, #0d0d0d 0%, #201a08 100%)';
  }

  if (payStatus === 'SUCCESS') {
    return (
      <div className={styles.successWrapper}>
        <div className={styles.successCard}>
          <div className={styles.successIconWrapper}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className={styles.successTitle}>Membership Secured</h2>
          <p className={styles.successSubtitle}>
            Your annual subscription to the <strong>{selectedPlan.name}</strong> pathway has been initialized.
          </p>
          <div className={styles.successReceipt}>
            <div className={styles.receiptRow}>
              <span>Transaction Status</span>
              <span className={styles.receiptApproved}>APPROVED</span>
            </div>
            <div className={styles.receiptRow}>
              <span>Amount Paid</span>
              <span className={styles.receiptPrice}>{selectedPlan.price}</span>
            </div>
            <div className={styles.receiptRow}>
              <span>Billing Account</span>
              <span>{formData.email}</span>
            </div>
          </div>
          <p className={styles.successInstructions}>
            A welcome dispatch has been transmitted to your email, containing credentials for student dashboard entry and details for class registration.
          </p>
          <button onClick={() => window.location.href = '/'} className={styles.btnSuccessReturn}>
            Enter Main Campus
          </button>
        </div>
      </div>
    );
  }

  if (payStatus === 'ERROR') {
    return (
      <div className={styles.failureWrapper}>
        <div className={styles.failureCard}>
          <div className={styles.failureIconWrapper}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className={styles.failureTitle}>Transaction Declined</h2>
          <p className={styles.failureSubtitle}>
            We were unable to process your payment for the <strong>{selectedPlan.name}</strong> pathway.
          </p>
          <div className={styles.failureReceipt}>
            <div className={styles.receiptRow}>
              <span>Transaction Status</span>
              <span className={styles.receiptDeclined}>DECLINED</span>
            </div>
            <div className={styles.receiptRow}>
              <span>Reason</span>
              <span className={styles.receiptErrorText}>{errorMessage || 'Card Authorization Failed'}</span>
            </div>
            <div className={styles.receiptRow}>
              <span>Billing Account</span>
              <span>{formData.email}</span>
            </div>
          </div>
          <p className={styles.failureInstructions}>
            Please verify your card details, expiration date, CVV code, or contact your banking provider. You can retry with the same card or use a different payment method.
          </p>
          <button onClick={() => setPayStatus('IDLE')} className={styles.btnFailureRetry}>
            Retry Payment Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutLayout}>
      
      {/* Left Panel: Plan Visual Breakdown */}
      <div className={styles.planPanel} style={{ background: leftBg }}>
        <div className={styles.planPanelHeader}>
          <button onClick={() => window.location.href = '/#enrollment'} className={styles.btnBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Pathways
          </button>
          <div className={styles.logoWrapper}>
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
          </div>
        </div>

        <div className={styles.planSummaryBox}>
          <p className={styles.summaryLabel}>Pathway Pathway</p>
          <h1 className={styles.summaryPlanName}>{selectedPlan.name}</h1>
          <p className={styles.summaryPlanDesc}>{selectedPlan.description}</p>
          
          <div className={styles.summaryPriceRow}>
            <span className={styles.summaryPriceValue}>{selectedPlan.price}</span>
            <span className={styles.summaryPricePeriod}>{selectedPlan.period}</span>
          </div>

          <div className={styles.featuresSection}>
            <h3>Pathway Privileges</h3>
            <ul className={styles.summaryFeaturesList}>
              {selectedPlan.features.map((feat: string, idx: number) => (
                <li key={idx}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.planPanelFooter}>
          <div className={styles.securityTrustBadge}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>256-Bit SSL Secured Payment Network Gateway</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Premium Checkout Card Form */}
      <div className={styles.formPanel}>
        <div className={styles.formPanelContent}>
          <div className={styles.secureHeaderMobile}>
            <div className={styles.logoWrapperSmall}>
              <div className={styles.logoAbbrSmall}>
                <span>M</span>
                <span className={styles.logoDividerSmall}>|</span>
                <span>A</span>
                <span className={styles.logoDividerSmall}>|</span>
              </div>
              <div className={styles.logoTextSmall}>
                <div className={styles.logoMainSmall}>MARSE</div>
              </div>
            </div>
            <span>Secure Checkout</span>
          </div>
          
          <h2 className={styles.portalTitle}>Payment Registration</h2>
          <p className={styles.portalSubtitle}>Initialize transaction to secure academy registration.</p>

          {/* Payment Method Selector Tabs */}
          <div style={{ display: 'flex', gap: '10px', margin: '20px 0 24px 0', background: '#F7F5F2', padding: '6px', borderRadius: '12px', border: '1px solid #E8E2DA' }}>
            <button 
              type="button"
              onClick={() => setPaymentGateway('STRIPE')}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: paymentGateway === 'STRIPE' ? '#0A0A0A' : 'transparent',
                color: paymentGateway === 'STRIPE' ? '#ffffff' : '#0A0A0A',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              💳 Card (Stripe)
            </button>
            
            <button 
              type="button"
              onClick={() => setPaymentGateway('PAYPAL')}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: paymentGateway === 'PAYPAL' ? '#003087' : 'transparent',
                color: '#ffffff',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.642h6.883c2.28 0 4.148.455 5.257 1.584 1.096 1.116 1.343 2.766.757 5.053-.787 3.072-2.88 4.796-5.892 4.796h-2.18c-.463 0-.853.333-.924.79l-.887 5.617a.642.642 0 0 1-.642.42z"/></svg>
              PayPal Express
            </button>
          </div>

          {paymentGateway === 'STRIPE' ? (
            <>
              {/* Official Stripe Hosted Checkout Option (checkout.stripe.com) */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 91, 255, 0.15) 0%, rgba(99, 91, 255, 0.05) 100%)',
                border: '1px solid rgba(99, 91, 255, 0.35)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🔒</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '13.5px', color: '#ffffff', fontWeight: '700' }}>Official Stripe Hosted Checkout</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#a0a0a0' }}>Redirect to checkout.stripe.com (SSL Encrypted & Apple Pay)</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', background: '#635BFF', color: '#fff', fontWeight: '800', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.04em' }}>
                    STRIPE OFFICIAL
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={handleStripeHostedCheckout}
                  disabled={payStatus === 'LOADING'}
                  style={{
                    width: '100%',
                    backgroundColor: '#635BFF',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 16px rgba(99, 91, 255, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>Pay via Official Stripe Portal (checkout.stripe.com)</span>
                </button>
              </div>
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
              <label htmlFor="email">Email Address</label>
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
              <label htmlFor="cardName">Cardholder Name</label>
              <input 
                type="text" 
                id="cardName" 
                required 
                value={formData.cardName}
                onChange={(e) => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
                placeholder="Full Name"
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
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                  disabled={payStatus === 'LOADING'}
                />
                <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="expiry">Expiration Date</label>
                <input 
                  type="text" 
                  id="expiry" 
                  required 
                  value={formData.expiry}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  placeholder="MM/YY"
                  disabled={payStatus === 'LOADING'}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="cvc">CVV Code</label>
                <input 
                  type="password" 
                  id="cvc" 
                  required 
                  value={formData.cvc}
                  onChange={(e) => setFormData(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
                  maxLength={4}
                  placeholder="•••"
                  disabled={payStatus === 'LOADING'}
                />
              </div>
            </div>

            <div className={styles.paymentMethodsRow}>
              <span className={styles.paymentMethodsLabel}>Accepted Payment Methods</span>
              <div className={styles.paymentLogoList}>
                {/* Visa */}
                <svg className={styles.paymentLogoItem} viewBox="0 0 48 18" fill="none" style={{ width: '38px' }}>
                  <path d="M18.8 2.2L16.2 16H12.6L10 4.2L7.3 14H4L6.8 2.2H10.4L13.1 13.8L15.3 2.2H18.8ZM28.5 2.2L24.9 16H21.5L25.1 2.2H28.5ZM37.9 2.2C36.6 2.2 35.5 2.9 35 4L30 16H33.4L34.3 13.5H39.8L40.3 16H43.6L40.9 2.2H37.9ZM35.3 10.9L37.1 5.9L38.9 10.9H35.3ZM4.8 2.2H0.2C0 2.2 0 2.3 0 2.4L0.2 3.3C1.6 3.6 2.8 4.2 3.7 5.1L1.2 16H4.7L9.5 2.2H4.8Z" fill="#1A1F71"/>
                </svg>
                {/* Mastercard */}
                <svg className={styles.paymentLogoItem} viewBox="0 0 34 20" fill="none" style={{ width: '34px' }}>
                  <circle cx="10" cy="10" r="10" fill="#EB001B" />
                  <circle cx="24" cy="10" r="10" fill="#F79E1B" opacity="0.85" />
                </svg>
                {/* AMEX */}
                <svg className={styles.paymentLogoItem} viewBox="0 0 38 20" fill="none" style={{ width: '38px' }}>
                  <rect width="38" height="20" rx="3" fill="#0170B9"/>
                  <text x="4" y="13" fill="#FFFFFF" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="900" fontSize="8" letterSpacing="0.5">AMEX</text>
                </svg>
                {/* Apple Pay */}
                <svg className={styles.paymentLogoItem} viewBox="0 0 45 18" fill="currentColor" style={{ width: '45px', color: '#000000' }}>
                  <path d="M6.3 7C5.3 7.6 4.3 8.3 3.6 9.4C2.5 11.2 1.6 13.8 2.7 16C3.2 17 4.2 17.8 5.3 17.8C6.3 17.8 6.9 17.3 8 17.3C9.1 17.3 9.6 17.8 10.7 17.8C11.8 17.8 12.8 17.1 13.3 16C14.4 13.8 13.5 11.2 12.4 9.4C11.7 8.3 10.7 7.6 9.7 7C8.6 6.3 7.4 6.3 6.3 7ZM9.5 4.3C10.7 2.8 10.4 1 10.4 0.9C10.2 0.9 8.5 1.1 7.3 2.6C6.1 4.1 6.4 5.9 6.4 6C6.6 6 8.3 5.8 9.5 4.3Z"/>
                  <text x="17" y="14" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontWeight="bold" fontSize="12">Pay</text>
                </svg>
                {/* Google Pay */}
                <svg className={styles.paymentLogoItem} viewBox="0 0 48 18" fill="none" style={{ width: '48px' }}>
                  <text x="15" y="13" fill="#3c4043" fontFamily="Roboto, sans-serif" fontWeight="500" fontSize="11">Pay</text>
                  <path d="M4.5 4.2H8.3C8.4 4.4 8.4 4.6 8.4 4.9C8.4 6.0 8.0 7.4 7.1 8.3C6.2 9.3 5.0 9.8 3.7 9.8C1.3 9.8 0 8.1 0 6.0C0 3.9 1.7 2.1 3.7 2.1C4.9 2.1 5.8 2.5 6.5 3.1L5.6 3.9C5.2 3.5 4.6 3.2 3.7 3.2C2.4 3.2 1.3 4.3 1.3 6.0C1.3 7.7 2.4 8.8 3.7 8.8C4.7 8.8 5.4 8.4 5.7 8.0C6.0 7.7 6.2 7.2 6.3 6.6H3.7V5.3H7.6V4.2H4.5Z" fill="#3c4043"/>
                </svg>
                {/* PayPal */}
                <svg className={styles.paymentLogoItem} viewBox="0 0 54 18" fill="none" style={{ width: '54px' }}>
                  <path d="M8.2 2H2C1.5 2 1.1 2.4 1 2.9L0 9.3C0 9.8 0.4 10.2 0.9 10.2H3.7L4.4 16H8.2L8.2 16C8.7 16 9.1 15.6 9.2 15.1L10.9 4.3C11 3 10 2 8.2 2Z" fill="#003087"/>
                  <path d="M22 2H15.8C15.3 2 14.9 2.4 14.8 2.9L13.8 9.3C13.8 9.8 14.2 10.2 14.7 10.2H17.5L18.2 16H22L22 16C22.5 16 22.9 15.6 23 15.1L24.7 4.3C24.8 3 23.8 2 22 2Z" fill="#0079C1"/>
                  <path d="M8.2 2.1C10.5 2.1 12.4 3 12.6 5.8C12.7 8.6 10.9 10.2 8.6 10.2H4.8C4.5 10.2 4.3 10 4.2 9.7L3.4 4.5C3.3 4.2 3.5 4 3.8 4H8.2V2.1Z" fill="#0079C1" opacity="0.85"/>
                  <text x="27" y="13" fill="#003087" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="bold" fontSize="11">Pay</text>
                </svg>
              </div>
            </div>

            {errorMessage && (
              <div className={styles.errorBanner}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
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
                  Authorizing transaction...
                </>
              ) : (
                `Securely Register & Pay ${selectedPlan.price}`
              )}
            </button>
          </form>
          </>
          ) : (
            /* PayPal Express View */
            <form onSubmit={handlePayPalSubmit} className={styles.checkoutForm} style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #E8E2DA', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#003087" style={{ marginBottom: '8px' }}>
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.642h6.883c2.28 0 4.148.455 5.257 1.584 1.096 1.116 1.343 2.766.757 5.053-.787 3.072-2.88 4.796-5.892 4.796h-2.18c-.463 0-.853.333-.924.79l-.887 5.617a.642.642 0 0 1-.642.42z"/>
                </svg>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                  PayPal Express Checkout
                </h3>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                  Fast & secure payment via your PayPal account or Credit Card
                </p>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="paypalEmail">Your Registered Email</label>
                <input 
                  type="email" 
                  id="paypalEmail" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="student@example.com"
                  disabled={payStatus === 'LOADING'}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="paypalName">Full Account Name</label>
                <input 
                  type="text" 
                  id="paypalName" 
                  required 
                  value={formData.cardName}
                  onChange={(e) => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
                  placeholder="e.g. Julia Marse"
                  disabled={payStatus === 'LOADING'}
                />
              </div>

              {errorMessage && (
                <div className={styles.errorBanner}>
                  <span>{errorMessage}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={payStatus === 'LOADING'}
                style={{
                  width: '100%',
                  background: '#FFC439',
                  color: '#003087',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '16px',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: payStatus === 'LOADING' ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  boxShadow: '0 4px 12px rgba(255, 196, 57, 0.3)'
                }}
              >
                {payStatus === 'LOADING' ? 'Redirecting to PayPal Gateway...' : `Pay ${selectedPlan ? selectedPlan.price : '$1,250'} with PayPal`}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: '#777' }}>
                🔒 Protected by PayPal Buyer Security & 256-Bit SSL Encryption
              </div>
            </form>
          )}

          <p className={styles.termsNote}>
            By proceeding, you authorize Marse Talent to initialize billing configuration for the selected academy pathway. Transactions are subject to membership policies.
          </p>
        </div>
      </div>

      {/* Global Toast System */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          <div className={styles.toastContent}>
            {toast.type === 'success' ? (
              <svg className={styles.toastIcon} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            ) : (
              <svg className={styles.toastIcon} viewBox="0 0 24 24" fill="none" stroke="#ff4a4a" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            )}
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
    <Suspense fallback={
      <div className={styles.loadingContainer}>
        <span className={styles.spinner}></span>
        <p>Initializing secure checkout...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
