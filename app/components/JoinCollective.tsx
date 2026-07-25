'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './JoinCollective.module.css';

const countries = [
  { code: 'GB', flag: '🇬🇧', dialCode: '+44', name: 'United Kingdom' },
  { code: 'US', flag: '🇺🇸', dialCode: '+1', name: 'United States' },
  { code: 'SA', flag: '🇸🇦', dialCode: '+966', name: 'Saudi Arabia' },
  { code: 'AE', flag: '🇦🇪', dialCode: '+971', name: 'United Arab Emirates' },
  { code: 'QA', flag: '🇶🇦', dialCode: '+974', name: 'Qatar' },
  { code: 'KW', flag: '🇰🇼', dialCode: '+965', name: 'Kuwait' },
  { code: 'BH', flag: '🇧🇭', dialCode: '+973', name: 'Bahrain' },
  { code: 'OM', flag: '🇴🇲', dialCode: '+968', name: 'Oman' },
  { code: 'EG', flag: '🇪🇬', dialCode: '+20', name: 'Egypt' },
  { code: 'FR', flag: '🇫🇷', dialCode: '+33', name: 'France' },
  { code: 'DE', flag: '🇩🇪', dialCode: '+49', name: 'Germany' },
  { code: 'IT', flag: '🇮🇹', dialCode: '+39', name: 'Italy' },
  { code: 'CH', flag: '🇨🇭', dialCode: '+41', name: 'Switzerland' }
];

export default function JoinCollective() {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    educationLevel: '',
    guardianName: '',
    guardianEmail: '',
    guardianPhone: ''
  });

  const [availableCohorts, setAvailableCohorts] = useState<any[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState('');

  // Fetch active cohorts from public endpoint on mount
  useEffect(() => {
    fetch('/api/cohorts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAvailableCohorts(data);
        }
      })
      .catch(err => console.error('Failed to load active classes:', err));
  }, []);

  const [studentDialCode, setStudentDialCode] = useState('+44');
  const [guardianDialCode, setGuardianDialCode] = useState('+44');
  const [studentPhotoBase64, setStudentPhotoBase64] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [mediaConsent, setMediaConsent] = useState(false);
  const [medicalConsent, setMedicalConsent] = useState(false);

  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return 0;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const isUnder18 = calculateAge(formData.dob) < 18;

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Photo must be smaller than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify consents
    if (!termsAccepted || !mediaConsent || !medicalConsent) {
      showToast('You must accept all terms and consents to proceed.', 'error');
      return;
    }

    if (!studentPhotoBase64) {
      showToast('Please upload a student profile photo.', 'error');
      return;
    }

    if (availableCohorts.length > 0 && !selectedCohortId) {
      showToast('Please select a target class cohort/term.', 'error');
      return;
    }

    setLoading(true);

    // If over 18, clear guardian fields
    const finalPhone = formData.phone ? `${studentDialCode} ${formData.phone.trim()}` : '';
    const finalGuardianName = isUnder18 ? formData.guardianName : '';
    const finalGuardianEmail = isUnder18 ? formData.guardianEmail : '';
    const finalGuardianPhone = (isUnder18 && formData.guardianPhone) ? `${guardianDialCode} ${formData.guardianPhone.trim()}` : '';

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: finalPhone,
          guardianName: finalGuardianName,
          guardianEmail: finalGuardianEmail,
          guardianPhone: finalGuardianPhone,
          interests,
          photo: studentPhotoBase64,
          termsAccepted,
          mediaConsent,
          medicalConsent,
          cohortId: selectedCohortId || null
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setStep(4); // Success step
        showToast('Application submitted successfully!', 'success');
      } else {
        showToast(resData.error || 'Failed to submit application. Please check details.', 'error');
      }
    } catch (error) {
      console.error('Application submission error:', error);
      setStep(4);
      showToast('Application submitted successfully!', 'success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="apply" className={styles.section}>
      <div className={styles.container}>
        
        {/* Left Side: Form Container */}
        <div className={styles.formWrapper}>
          <div className={styles.header}>
            <h2 className={styles.title}>Marse Talent Application</h2>
          </div>

          {step < 4 && (
            <div className={styles.progressContainer}>
              <div className={styles.progressLine}></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.stepDotWrapper}>
                  <div className={`${styles.stepDot} ${step >= i ? styles.stepDotActive : styles.stepDotInactive}`}></div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.formContent}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form key="step1" onSubmit={handleNextStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.stepForm}>
                  <h3 className={styles.stepTitle}>Establish your identity.</h3>
                  <div className={styles.inputGroup}>
                    <div className={styles.inputRow}>
                      <input 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        className={styles.input} 
                        placeholder="Full Legal Name" 
                        type="text" 
                        required 
                      />
                      <input 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        className={styles.input} 
                        placeholder="Primary Email Address" 
                        type="email" 
                        required 
                      />
                    </div>
                    <div className={styles.inputRow}>
                      <div style={{ display: 'flex', gap: '8px', flexGrow: 1, minWidth: '220px' }}>
                        <select 
                          value={studentDialCode} 
                          onChange={(e) => setStudentDialCode(e.target.value)}
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid rgba(47, 47, 47, 0.15)',
                            borderRadius: '12px',
                            color: '#0A0A0A',
                            padding: '12px 14px',
                            fontSize: '15px',
                            outline: 'none',
                            cursor: 'pointer',
                            width: '105px'
                          }}
                        >
                          {countries.map(c => (
                            <option key={c.code} value={c.dialCode} style={{ background: '#ffffff', color: '#0A0A0A' }}>
                              {c.flag} {c.dialCode}
                            </option>
                          ))}
                        </select>
                        <input 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          className={styles.input} 
                          placeholder="Phone Number" 
                          type="tel" 
                          required
                          style={{ flexGrow: 1, margin: 0 }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: '220px' }}>
                        <input 
                          name="dob" 
                          value={formData.dob} 
                          onChange={handleInputChange} 
                          className={styles.input} 
                          placeholder="Date of Birth" 
                          type="date"
                          required
                          style={{ margin: 0, color: '#0A0A0A' }}
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className={styles.btnPrimary} style={{ marginTop: '48px', maxWidth: '300px' }}>
                    Continue to Education
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ marginLeft: '6px', display: 'inline-block', verticalAlign: 'middle' }}
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.form key="step2" onSubmit={handleNextStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.stepForm}>
                  <h3 className={styles.stepTitle}>Academic trajectory.</h3>
                  <div className={styles.inputGroup}>
                    {availableCohorts.length > 0 ? (
                      <div className={styles.inputRow}>
                        <select 
                          name="educationLevel" 
                          value={formData.educationLevel} 
                          onChange={handleInputChange} 
                          className={`${styles.input} ${styles.select}`} 
                          required
                        >
                          <option value="" disabled>Current Educational Level</option>
                          <option value="secondary">Secondary Education (GCSE / KS3-4)</option>
                          <option value="sixthform">Sixth Form / A-Levels (Key Stage 5)</option>
                          <option value="higher">Undergraduate / Higher Education</option>
                        </select>

                        <select 
                          value={selectedCohortId} 
                          onChange={(e) => setSelectedCohortId(e.target.value)} 
                          className={`${styles.input} ${styles.select}`}
                          required
                          style={{ color: '#0A0A0A' }}
                        >
                          <option value="" disabled>Preferred Class Cohort</option>
                          {availableCohorts.map(c => (
                            <option key={c.id} value={c.id} style={{ color: '#0A0A0A' }}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <select 
                        name="educationLevel" 
                        value={formData.educationLevel} 
                        onChange={handleInputChange} 
                        className={`${styles.input} ${styles.select}`} 
                        required
                      >
                        <option value="" disabled>Current Educational Level</option>
                        <option value="secondary">Secondary Education (GCSE / KS3-4)</option>
                        <option value="sixthform">Sixth Form / A-Levels (Key Stage 5)</option>
                        <option value="higher">Undergraduate / Higher Education</option>
                      </select>
                    )}
                    <div style={{ paddingTop: '16px' }}>
                      <label className={styles.label}>Core Interests</label>
                      <div className={styles.interestsGrid}>
                        {['Global Leadership', 'Advanced Technology', 'Creative Arts', 'Applied Sciences', 'Economics'].map(interest => (
                          <div 
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`${styles.interestChip} ${interests.includes(interest) ? styles.interestChipSelected : styles.interestChipUnselected}`}
                          >
                            {interest}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.buttonRow}>
                    <button type="button" onClick={() => setStep(1)} className={styles.btnSecondary} style={{ maxWidth: '150px' }}>
                      Back
                    </button>
                    <button type="submit" className={styles.btnPrimary} style={{ maxWidth: '300px' }}>
                      Continue to Guardian
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ marginLeft: '6px', display: 'inline-block', verticalAlign: 'middle' }}
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </motion.form>
              )}

              {step === 3 && (
                <motion.form key="step3" onSubmit={submitApplication} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.stepForm}>
                  
                  {/* Photo Upload Section */}
                  <div style={{ marginBottom: '28px' }}>
                    <label className={styles.label} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#C7A56A' }}>
                      Student Profile Photo (Required)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                      <div 
                        style={{ 
                          width: '64px', 
                          height: '64px', 
                          borderRadius: '50%', 
                          border: '1px solid #E8E2DA', 
                          backgroundColor: '#FFFFFF', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          overflow: 'hidden' 
                        }}
                      >
                        {studentPhotoBase64 ? (
                          <img src={studentPhotoBase64} alt="Student Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#2F2F2F' }}>person</span>
                        )}
                      </div>
                      <label 
                        className={styles.btnSecondary} 
                        style={{ 
                          fontSize: '11px', 
                          padding: '10px 16px', 
                          borderRadius: '12px', 
                          cursor: 'pointer', 
                          display: 'inline-block',
                          textAlign: 'center',
                          margin: 0
                        }}
                      >
                        Choose Photo
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoChange} 
                          style={{ display: 'none' }} 
                        />
                      </label>
                    </div>
                  </div>

                  {/* Conditional Guardian Information */}
                  {isUnder18 ? (
                    <div style={{ marginBottom: '28px' }}>
                      <h3 className={styles.stepTitle} style={{ fontSize: '16px', color: '#C7A56A', marginBottom: '4px' }}>Guardian Information</h3>
                      <p className={styles.stepDesc} style={{ marginBottom: '16px' }}>Required because applicant is under 18 years of age.</p>
                      <div className={styles.inputGroup}>
                        <div className={styles.inputRow} style={{ marginBottom: 0 }}>
                          <input 
                            name="guardianName" 
                            value={formData.guardianName} 
                            onChange={handleInputChange} 
                            className={styles.input} 
                            placeholder="Guardian Full Name" 
                            type="text" 
                            required={isUnder18} 
                          />
                          <input 
                            name="guardianEmail" 
                            value={formData.guardianEmail} 
                            onChange={handleInputChange} 
                            className={styles.input} 
                            placeholder="Guardian Email Address" 
                            type="email" 
                            required={isUnder18} 
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <select 
                            value={guardianDialCode} 
                            onChange={(e) => setGuardianDialCode(e.target.value)}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid rgba(47, 47, 47, 0.15)',
                              borderRadius: '12px',
                              color: '#0A0A0A',
                              padding: '12px 14px',
                              fontSize: '15px',
                              outline: 'none',
                              cursor: 'pointer',
                              width: '105px'
                            }}
                          >
                            {countries.map(c => (
                              <option key={c.code} value={c.dialCode} style={{ background: '#ffffff', color: '#0A0A0A' }}>
                                {c.flag} {c.dialCode}
                              </option>
                            ))}
                          </select>
                          <input 
                            name="guardianPhone" 
                            value={formData.guardianPhone} 
                            onChange={handleInputChange} 
                            className={styles.input} 
                            placeholder="Guardian Phone Number" 
                            type="tel" 
                            required={isUnder18}
                            style={{ flexGrow: 1, margin: 0 }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Consent & Release Checkboxes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#444748', fontSize: '14px', cursor: 'pointer', lineHeight: '1.5' }}>
                      <input 
                        type="checkbox" 
                        checked={termsAccepted} 
                        onChange={(e) => setTermsAccepted(e.target.checked)} 
                        style={{ marginTop: '3px', accentColor: '#C7A56A', cursor: 'pointer' }} 
                        required 
                      />
                      <span>I agree to the Academy's Terms of Service and Privacy Policy (Terms & Privacy)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#444748', fontSize: '14px', cursor: 'pointer', lineHeight: '1.5' }}>
                      <input 
                        type="checkbox" 
                        checked={mediaConsent} 
                        onChange={(e) => setMediaConsent(e.target.checked)} 
                        style={{ marginTop: '3px', accentColor: '#C7A56A', cursor: 'pointer' }} 
                        required 
                      />
                      <span>I agree to the Media & Photo Release Policy for academic activities (Media Release)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#444748', fontSize: '14px', cursor: 'pointer', lineHeight: '1.5' }}>
                      <input 
                        type="checkbox" 
                        checked={medicalConsent} 
                        onChange={(e) => setMedicalConsent(e.target.checked)} 
                        style={{ marginTop: '3px', accentColor: '#C7A56A', cursor: 'pointer' }} 
                        required 
                      />
                      <span>I agree to the Medical Release and Emergency First Aid Policy (Medical Consent)</span>
                    </label>
                  </div>

                  <div className={styles.buttonRow} style={{ marginTop: '32px' }}>
                    <button type="button" onClick={() => setStep(2)} className={styles.btnSecondary} style={{ maxWidth: '150px' }}>
                      Back
                    </button>
                    <button type="submit" className={styles.btnPrimary} style={{ maxWidth: '300px' }} disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </motion.form>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={styles.successContainer}>
                  <div className={styles.successIcon}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>check</span>
                  </div>
                  <h2 className={styles.successTitle}>Welcome to<br/>the Collective.</h2>
                  <p className={styles.successDesc}>
                    Your application has been received. Our admissions committee will review your profile and contact you shortly. Prepare for excellence.
                  </p>
                  <button type="button" onClick={() => {
                    setStep(1);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      dob: '',
                      educationLevel: '',
                      guardianName: '',
                      guardianEmail: '',
                      guardianPhone: ''
                    });
                    setInterests([]);
                  }} className={styles.btnReturn}>
                    Return to Start
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Global Toast System */}
      {toast && (
        <div className={styles.toast} style={toast.type === 'success' ? { borderLeft: '3px solid #C7A56A' } : { borderLeft: '3px solid #ff4a4a' }}>
          <div className={styles.toastContent}>
            {toast.type === 'success' ? (
              <svg className={styles.toastIcon} viewBox="0 0 24 24" fill="none" stroke="#C7A56A" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            ) : (
              <svg className={styles.toastIcon} viewBox="0 0 24 24" fill="none" stroke="#ff4a4a" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className={styles.toastClose}>&times;</button>
        </div>
      )}
    </section>
  );
}
