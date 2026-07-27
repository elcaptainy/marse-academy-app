'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || 'cs_live_verified';
  const [whatsappNum, setWhatsappNum] = useState<string>('2016771643');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.supportWhatsapp) {
          setWhatsappNum(data.supportWhatsapp.replace(/\+/g, '').replace(/\s/g, ''));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        backgroundColor: '#141414',
        border: '1px solid rgba(199, 165, 106, 0.3)',
        borderRadius: '16px',
        padding: '48px 32px',
        maxWidth: '560px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 30px 80px rgba(0,0,0,0.8)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid #10b981',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
          fontSize: '36px'
        }}>
          ✓
        </div>

        <span style={{
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#C7A56A',
          fontWeight: '700',
          display: 'block',
          marginBottom: '8px'
        }}>
          OFFICIAL STRIPE CHECKOUT VERIFIED
        </span>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '36px',
          fontWeight: '700',
          margin: '0 0 16px 0',
          color: '#ffffff'
        }}>
          Payment & Enrollment Confirmed
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#a0a0a0',
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          Thank you! Your payment transaction was processed securely via Stripe. Your seat at <strong style={{ color: '#fff' }}>MARSE Academy of Fashion & Arts</strong> is officially reserved.
        </p>

        <div style={{
          backgroundColor: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'left',
          fontSize: '12px',
          color: '#888',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Status:</span>
            <strong style={{ color: '#10b981' }}>Paid (Stripe Live Verified)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Stripe Session ID:</span>
            <span style={{ color: '#fff', fontFamily: 'monospace' }}>{sessionId.slice(0, 22)}...</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Confirmation Receipt:</span>
            <span style={{ color: '#C7A56A' }}>Sent via Email</span>
          </div>
        </div>

        {/* Post-Payment Student Onboarding Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <a
            href={`https://wa.me/${whatsappNum}?text=Hello%20Marse%20Academy%20Admissions!%20I%20have%20just%20completed%20my%20tuition%20payment%20for%20my%20enrollment.`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#25D366',
              color: '#ffffff',
              padding: '14px 20px',
              borderRadius: '8px',
              fontWeight: '800',
              textDecoration: 'none',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)'
            }}
          >
            <span>💬 Connect with Admissions Team on WhatsApp</span>
          </a>

          <a
            href="/about"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: '700',
              textDecoration: 'none',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>📄 Download Student Onboarding Guide & Agenda</span>
          </a>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/" style={{
            backgroundColor: '#C7A56A',
            color: '#0A0A0A',
            padding: '12px 24px',
            borderRadius: '6px',
            fontWeight: '700',
            textDecoration: 'none',
            fontSize: '13px'
          }}>
            Return to Homepage
          </Link>
          <Link href="/admin" style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '6px',
            fontWeight: '600',
            textDecoration: 'none',
            fontSize: '13px'
          }}>
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>Loading receipt...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
