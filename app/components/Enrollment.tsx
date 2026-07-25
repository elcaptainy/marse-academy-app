'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Enrollment.module.css';

export default function Enrollment({ initialData, initialSettings }: { initialData?: any[], initialSettings?: any }) {
  const [plans, setPlans] = useState<any[]>(initialData || [
    {
      id: '1',
      name: 'Monthly',
      description: 'Flexible membership for ongoing access.',
      price: '$4,500',
      period: '/mo',
      features: ['Standard Curriculum Access', 'Digital Library Entry', 'Monthly Progress Reviews'],
      isFeatured: false,
      badge: 'NONE'
    },
    {
      id: '2',
      name: 'Full Annual',
      description: 'The complete Marse Talent experience with exclusive privileges.',
      price: '$48,000',
      period: '/yr',
      features: ['Elite Access Benefits Included', 'Priority Course Registration', 'Dedicated Academic Advisor', 'Global Alumni Network Entry'],
      isFeatured: true,
      badge: 'RECOMMENDED'
    },
    {
      id: '3',
      name: 'Quarterly',
      description: 'Structured installments aligned with academic terms.',
      price: '$12,500',
      period: '/quarter',
      features: ['Standard Curriculum Access', 'Term-based Advisory Sessions', 'Campus Facilities Access'],
      isFeatured: false,
      badge: 'NONE'
    }
  ]);

  const [logoUrl, setLogoUrl] = useState(initialSettings?.logoUrl || '/logo.png');

  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPlans(data);
        }
      })
      .catch(err => console.error('Failed to fetch pricing plans:', err));

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      })
      .catch(err => console.error('Failed to fetch global logo settings:', err));
  }, []);

  const handleSelectPlan = (plan: any) => {
    window.location.href = `/checkout?plan=${plan.id}`;
  };

  return (
    <section id="enrollment" className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
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
        <p className={styles.subtitle}>Admissions Portal</p>
        <h2 className={styles.title}>Secure Your Place</h2>
        <p className={styles.description}>
          Select your preferred enrollment pathway. Every tier grants access to the global standard of academic excellence and our exclusive network.
        </p>
      </div>

      {/* Plans Grid */}
      <div className={styles.plansGrid}>
        {plans.map((plan, index) => {
          let cardClass = styles.planCard;
          let isDark = false;
          let badgeLabel = '';
          let badgeBgColor = '#fed65b';
          let badgeTextColor = '#745c00';

          if (plan.badge === 'RECOMMENDED') {
            cardClass = styles.featuredPlanCard;
            isDark = true;
            badgeLabel = 'RECOMMENDED';
          } else if (plan.badge === 'MOST_POPULAR') {
            cardClass = styles.navyPlanCard;
            isDark = true;
            badgeLabel = 'MOST POPULAR';
            badgeBgColor = '#3b82f6';
            badgeTextColor = '#ffffff';
          } else if (plan.badge === 'ELITE') {
            cardClass = styles.goldPlanCard;
            isDark = true;
            badgeLabel = 'ELITE ACCESS';
            badgeBgColor = '#D4AF37';
            badgeTextColor = '#000000';
          } else if (plan.isFeatured) {
            cardClass = styles.featuredPlanCard;
            isDark = true;
            badgeLabel = 'RECOMMENDED';
          }

          return (
            <motion.div 
              key={plan.id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cardClass}
            >
              {badgeLabel && (
                <div 
                  className={styles.badge} 
                  style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
                >
                  {badgeLabel}
                </div>
              )}
              <div style={{ marginBottom: '32px' }}>
                <h3 className={isDark ? styles.featuredPlanTitle : styles.planTitle}>{plan.name}</h3>
                <p className={isDark ? styles.featuredPlanDesc : styles.planDesc}>{plan.description}</p>
                <div className={styles.priceContainer}>
                  <span className={isDark ? styles.featuredPrice : styles.price}>{plan.price}</span>
                  <span className={isDark ? styles.featuredPricePeriod : styles.pricePeriod}>{plan.period}</span>
                </div>
              </div>
              <ul className={styles.featureList}>
                {plan.features.map((feature: string, idx: number) => (
                  <li key={idx} className={styles.featureItem}>
                    <span className={`material-symbols-outlined ${isDark ? styles.featuredFeatureIcon : styles.featureIcon}`}>
                      {plan.badge === 'ELITE' ? 'workspace_premium' : 'check_circle'}
                    </span>
                    <span className={isDark ? styles.featuredFeatureText : styles.featureText}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleSelectPlan(plan)}
                className={isDark ? styles.featuredSelectBtn : styles.selectBtn}
              >
                Choose Plan
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
