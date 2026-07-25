'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Upload progress states
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadPercent, setUploadPercent] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'applications' | 'mentors' | 'pricing' | 'faqs' | 'hero' | 'about' | 'features' | 'bento' | 'finance' | 'testimonials' | 'elcaptain' | 'cohorts' | 'attendance' | 'staff' | 'whatsapp' | 'subjects' | 'journey' | 'settings' | 'programs' | 'contact'>('dashboard');

  // WhatsApp states
  const [whatsappSettings, setWhatsappSettings] = useState({
    twilioSid: '',
    twilioToken: '',
    twilioNumber: '',
    autoOnAbsence: true,
    autoOnApproval: true
  });
  const [whatsappLogs, setWhatsappLogs] = useState<any[]>([]);
  const [whatsappTestTo, setWhatsappTestTo] = useState('');
  const [whatsappTestMsg, setWhatsappTestMsg] = useState('');
  const [isSendingWhatsappTest, setIsSendingWhatsappTest] = useState(false);

  // Cohorts, Attendance & Staff States
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);

  // Cohort Form State
  const [newCohortName, setNewCohortName] = useState('');
  const [newCohortStartDate, setNewCohortStartDate] = useState('');
  const [newCohortEndDate, setNewCohortEndDate] = useState('');
  const [newCohortCapacity, setNewCohortCapacity] = useState('20');

  // Staff Form State
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('INSTRUCTOR');
  const [newStaffPassword, setNewStaffPassword] = useState('');

  // Attendance Sheet Filter/Active states
  const [selectedCohortId, setSelectedCohortId] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'>>({});

  // Elcaptain Email System states
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignHeaderTitle, setCampaignHeaderTitle] = useState('');
  const [campaignBodyText, setCampaignBodyText] = useState('');
  const [campaignCtaLabel, setCampaignCtaLabel] = useState('');
  const [campaignCtaUrl, setCampaignCtaUrl] = useState('');
  const [campaignHeaderImage, setCampaignHeaderImage] = useState('');
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);
  const [campaignSendProgress, setCampaignSendProgress] = useState('');

  // Student Portfolio & Assessment States
  const [selectedStudentForPortfolio, setSelectedStudentForPortfolio] = useState<any | null>(null);
  const [studentPortfolioRating, setStudentPortfolioRating] = useState<number>(0);
  const [studentPortfolioNotes, setStudentPortfolioNotes] = useState<string>('');
  const [studentPortfolioPhotos, setStudentPortfolioPhotos] = useState<string[]>([]);
  const [isSavingPortfolio, setIsSavingPortfolio] = useState<boolean>(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState<any | null>(null);

  // Sidebar visibility toggle
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [cmsDropdownOpen, setCmsDropdownOpen] = useState(false);

  // Theme toggle: dark (default) / light
  const [isLightMode, setIsLightMode] = useState(false);

  // Finance tab filter states
  const [financeFilter, setFinanceFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'CUSTOM'>('ALL');
  const [financeSearch, setFinanceSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Loaded states
  const [applications, setApplications] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [curriculumFeatures, setCurriculumFeatures] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  // Testimonials form
  const [newTestimonial, setNewTestimonial] = useState({ quote: '', author: '', role: '' });
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

  // Custom Dynamic CMS states
  const [coreSubjects, setCoreSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);

  const [journeySteps, setJourneySteps] = useState<any[]>([]);
  const [selectedJourneyStep, setSelectedJourneyStep] = useState<any | null>(null);

  const [globalSettings, setGlobalSettings] = useState<any>({
    logoUrl: '',
    supportWhatsapp: '',
    supportEmail: '',
    showStats: true,
    showFooterGallery: true,
    stat1Value: '',
    stat1Label: '',
    stat2Value: '',
    stat2Label: '',
    stat3Value: '',
    stat3Label: '',
    stat4Value: '',
    stat4Label: '',
    instagramUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    pinterestUrl: ''
  });

  const [programs, setPrograms] = useState<any[]>([]);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [editingProgram, setEditingProgram] = useState<any>({ title: '', desc: '', img: '' });
  const [newProgram, setNewProgram] = useState<any>({ title: '', desc: '', img: '' });
  const [aboutSettings, setAboutSettings] = useState<any>({
    heroTitle: '',
    heroLead: '',
    heroImageBack: '',
    heroImageFront: '',
    storyTitle: '',
    storyText1: '',
    storyText2: '',
    storyQuote: '',
    missionTitle: '',
    missionText: '',
    missionImage: '',
    founderName: '',
    founderTitle: '',
    founderBio1: '',
    founderBio2: '',
    founderImage: '',
    founderSignature: '',
    safeguardingTitle: '',
    safeguardingText: ''
  });

  const [heroSettings, setHeroSettings] = useState<any>({
    title: '',
    description: '',
    videoUrl: '',
    imageUrl: '',
    mediaType: 'VIDEO', // 'VIDEO' or 'IMAGE'
    mediaPosition: '50%',
    mediaPositionX: '50%',
    mediaPositionY: '50%',
    mediaScale: 1.0,
    mediaOverlay: 0.4
  });
  const [showHeroPreview, setShowHeroPreview] = useState(false);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showGrid, setShowGrid] = useState(false);

  // Drag states for Hero repositioning
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartPercentX, setDragStartPercentX] = useState(50);
  const [dragStartPercentY, setDragStartPercentY] = useState(50);
  const mediaContainerRef = useRef<HTMLDivElement | null>(null);

  const handleMediaDragStart = (clientX: number, clientY: number) => {
    setIsDraggingMedia(true);
    setDragStartX(clientX);
    setDragStartY(clientY);
    const currentPercentX = parseInt(heroSettings.mediaPositionX || '50', 10);
    const currentPercentY = parseInt(heroSettings.mediaPositionY || '50', 10);
    setDragStartPercentX(currentPercentX);
    setDragStartPercentY(currentPercentY);
  };

  const handleMediaDragMove = (clientX: number, clientY: number) => {
    if (!isDraggingMedia || !mediaContainerRef.current) return;
    
    const containerWidth = mediaContainerRef.current.clientWidth || 500;
    const containerHeight = mediaContainerRef.current.clientHeight || 500;
    
    const deltaX = clientX - dragStartX;
    const deltaY = clientY - dragStartY;
    
    const deltaPercentX = (deltaX / containerWidth) * 100;
    const deltaPercentY = (deltaY / containerHeight) * 100;
    
    let newPercentX = dragStartPercentX - deltaPercentX;
    let newPercentY = dragStartPercentY - deltaPercentY;
    
    newPercentX = Math.max(0, Math.min(100, newPercentX));
    newPercentY = Math.max(0, Math.min(100, newPercentY));
    
    setHeroSettings((prev: any) => ({
      ...prev,
      mediaPositionX: Math.round(newPercentX) + '%',
      mediaPositionY: Math.round(newPercentY) + '%'
    }));
  };

  const handleMediaDragEnd = () => {
    setIsDraggingMedia(false);
  };

  // Forms states
  const [newMentor, setNewMentor] = useState<any>({
    name: '',
    role: '',
    subjectTaught: '',
    bio: '',
    experienceCredits: '',
    image: '',
    video: '',
    instagram: '#',
    linkedin: '#',
    behance: '#',
    website: '#',
    hidden: false
  });
  const [editingMentorId, setEditingMentorId] = useState<string | null>(null);

  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: ''
  });
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  // Stats calculation
  const totalApplications = applications.length;
  const totalEarnings = transactions.reduce((acc, t) => {
    const num = parseInt(t.amount.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + num;
  }, 0);

  // Trigger Toast Notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Authenticate user
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        loadAllData();
        showToast('Authenticated successfully as Admin', 'success');
      } else {
        setLoginError(data.error || 'Invalid credentials');
        showToast(data.error || 'Invalid credentials', 'error');
      }
    } catch (err) {
      setLoginError('Failed to login. Try again.');
      showToast('Authentication connection error', 'error');
    }
  };

  // Load all CMS data
  const loadAllData = () => {
    fetch('/api/applications').then(res => res.json()).then(data => setApplications(data)).catch(err => {});
    fetch('/api/checkout').then(res => res.json()).then(data => setTransactions(data)).catch(err => {});
    fetch('/api/mentors').then(res => res.json()).then(data => setMentors(data)).catch(err => {});
    fetch('/api/pricing').then(res => res.json()).then(data => setPricing(data)).catch(err => {});
    fetch('/api/faqs').then(res => res.json()).then(data => setFaqs(data)).catch(err => {});
    fetch('/api/hero').then(res => res.json()).then(data => setHeroSettings(data)).catch(err => {});
    fetch('/api/features').then(res => res.json()).then(data => setCurriculumFeatures(data)).catch(err => {});
    fetch('/api/gallery').then(res => res.json()).then(data => setGallery(data)).catch(err => {});
    fetch('/api/testimonials').then(res => res.json()).then(data => setTestimonials(data)).catch(err => {});
    fetch('/api/admin/cohorts').then(res => res.json()).then(data => {
      setCohorts(data);
      if (data.length > 0 && !selectedCohortId) {
        setSelectedCohortId(data[0].id);
      }
    }).catch(err => {});
    fetch('/api/admin/attendance').then(res => res.json()).then(data => setAttendanceLogs(data)).catch(err => {});
    fetch('/api/admin/staff').then(res => res.json()).then(data => setStaffList(data)).catch(err => {});
    fetch('/api/admin/whatsapp').then(res => res.json()).then(data => {
      if (data.success) {
        setWhatsappSettings(data.settings);
        setWhatsappLogs(data.logs);
      }
    }).catch(err => {});
    fetch('/api/subjects').then(res => res.json()).then(data => setCoreSubjects(data)).catch(err => {});
    fetch('/api/journey').then(res => res.json()).then(data => setJourneySteps(data)).catch(err => {});
    fetch('/api/settings').then(res => res.json()).then(data => setGlobalSettings(data)).catch(err => {});
    fetch('/api/about').then(res => res.json()).then(data => setAboutSettings(data)).catch(err => {});
    fetch('/api/programs').then(res => res.json()).then(data => setPrograms(data)).catch(err => {});
  };

  // Run initial auth check
  useEffect(() => {
    fetch('/api/admin/login')
      .then(res => {
        if (res.status === 401) {
          setIsLoggedIn(false);
        } else if (res.ok) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      })
      .finally(() => {
        setIsAuthChecking(false);
      });
  }, []);

  // Fetch data on login or tab changes
  useEffect(() => {
    if (isLoggedIn) {
      loadAllData();
    }
  }, [isLoggedIn, activeTab]);

  // Live real-time polling — refreshes critical data every 7 seconds
  useEffect(() => {
    if (!isLoggedIn) return;
    const liveInterval = setInterval(() => {
      fetch('/api/applications').then(r => r.json()).then(d => setApplications(d)).catch(() => {});
      fetch('/api/checkout').then(r => r.json()).then(d => setTransactions(d)).catch(() => {});
    }, 7000);
    return () => clearInterval(liveInterval);
  }, [isLoggedIn]);

  // Add Cohort
  const handleAddCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/cohorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCohortName,
          startDate: newCohortStartDate,
          endDate: newCohortEndDate,
          capacity: newCohortCapacity
        })
      });
      const data = await response.json();
      if (data.success) {
        setCohorts(prev => [...prev, data.data]);
        setNewCohortName('');
        setNewCohortStartDate('');
        setNewCohortEndDate('');
        showToast('Class Cohort created successfully', 'success');
      } else {
        showToast(data.error || 'Failed to create cohort', 'error');
      }
    } catch (err) {
      showToast('Error connecting to API', 'error');
    }
  };

  // Delete Cohort
  const handleDeleteCohort = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cohort? This cannot be undone.')) return;
    try {
      const response = await fetch(`/api/admin/cohorts?id=${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setCohorts(prev => prev.filter(c => c.id !== id));
        showToast('Cohort deleted', 'success');
      } else {
        showToast(data.error || 'Failed to delete cohort', 'error');
      }
    } catch (err) {
      showToast('Error connecting to API', 'error');
    }
  };

  // Add Staff Member
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStaffName,
          email: newStaffEmail,
          role: newStaffRole,
          password: newStaffPassword
        })
      });
      const data = await response.json();
      if (data.success) {
        setStaffList(prev => [...prev, data.data]);
        setNewStaffName('');
        setNewStaffEmail('');
        setNewStaffPassword('');
        showToast('Staff account created successfully', 'success');
      } else {
        showToast(data.error || 'Failed to create staff account', 'error');
      }
    } catch (err) {
      showToast('Error connecting to API', 'error');
    }
  };

  // Delete Staff Member
  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    try {
      const response = await fetch(`/api/admin/staff?id=${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setStaffList(prev => prev.filter(s => s.id !== id));
        showToast('Staff member deleted', 'success');
      } else {
        showToast(data.error || 'Failed to delete staff member', 'error');
      }
    } catch (err) {
      showToast('Error connecting to API', 'error');
    }
  };

  // Assign Student to Cohort
  const handleAssignStudentCohort = async (studentId: string, cohortId: string) => {
    try {
      const response = await fetch('/api/admin/applications/cohort', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: studentId, cohortId: cohortId || null })
      });
      const data = await response.json();
      if (data.success) {
        setApplications(prev => prev.map(app => app.id === studentId ? { ...app, cohortId } : app));
        showToast('Student cohort assignment updated', 'success');
      } else {
        showToast(data.error || 'Failed to update cohort assignment', 'error');
      }
    } catch (err) {
      showToast('Error connecting to API', 'error');
    }
  };

  // Save Attendance Sheet
  const handleSaveAttendance = async () => {
    if (!selectedCohortId) return;
    const recordsArray = Object.keys(attendanceRecords).map(studentId => ({
      studentId,
      status: attendanceRecords[studentId]
    }));
    try {
      const response = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohortId: selectedCohortId,
          date: attendanceDate,
          records: recordsArray
        })
      });
      const data = await response.json();
      if (data.success) {
        fetch('/api/admin/attendance').then(res => res.json()).then(data => setAttendanceLogs(data)).catch(err => {});
        showToast('Attendance record saved successfully', 'success');
      } else {
        showToast(data.error || 'Failed to save attendance records', 'error');
      }
    } catch (err) {
      showToast('Error connecting to API', 'error');
    }
  };

  // Pre-load attendance records when cohort or date changes
  useEffect(() => {
    if (!selectedCohortId || !attendanceDate) return;
    const log = attendanceLogs.find(l => l.cohortId === selectedCohortId && l.date === attendanceDate);
    
    const initialRecords: Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'> = {};
    const cohortStudents = applications.filter(app => app.cohortId === selectedCohortId && app.status === 'APPROVED');
    
    cohortStudents.forEach(st => {
      initialRecords[st.id] = 'PRESENT';
    });

    if (log && log.records) {
      log.records.forEach((r: any) => {
        initialRecords[r.studentId] = r.status;
      });
    }
    
    setAttendanceRecords(initialRecords);
  }, [selectedCohortId, attendanceDate, attendanceLogs, applications]);

  // Professional XHR-based file upload with progress tracking
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string, onUploadSuccess: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Performance warning check
    const maxRecommendedSize = 30 * 1024 * 1024; // 30MB
    if (file.size > maxRecommendedSize) {
      showToast('Warning: Files larger than 30MB can cause slow load times on the web. Consider compressing.', 'error');
    }

    setUploadingKey(fieldKey);
    setUploadPercent(0);

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadPercent(percent);
      }
    });

    xhr.addEventListener('load', () => {
      setUploadingKey(null);
      setUploadPercent(0);

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success) {
            onUploadSuccess(res.url);
            showToast('Asset uploaded successfully!', 'success');
          } else {
            showToast(res.error || 'File upload failed', 'error');
          }
        } catch (err) {
          showToast('Failed to parse upload server response', 'error');
        }
      } else {
        let errorMsg = 'Upload failed';
        if (xhr.status === 413) {
          errorMsg = 'File too large (exceeds server limits)';
        } else if (xhr.status === 401) {
          errorMsg = 'Unauthorized upload request';
        } else {
          errorMsg = `Upload failed with status code ${xhr.status}`;
        }
        showToast(errorMsg, 'error');
      }
    });

    xhr.addEventListener('error', () => {
      setUploadingKey(null);
      setUploadPercent(0);
      showToast('Network connection error during upload', 'error');
    });

    xhr.open('POST', '/api/admin/upload');
    xhr.send(formData);
  };

  // Update Application Status
  const handleUpdateAppStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
        showToast(`Application marked as ${status.toLowerCase()}`, 'success');
      } else {
        showToast('Failed to update application status', 'error');
      }
    } catch (error) {
      showToast('Failed to update application status', 'error');
    }
  };

  // Update Hero Settings
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroSettings)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Hero Settings updated successfully!', 'success');
      } else {
        showToast('Failed to save Hero settings', 'error');
      }
    } catch (error) {
      showToast('Failed to save Hero settings', 'error');
    }
  };

  // Add / Edit Mentor
  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newMentor,
      socials: { 
        instagram: newMentor.instagram, 
        linkedin: newMentor.linkedin, 
        behance: newMentor.behance,
        website: newMentor.website 
      }
    };

    try {
      const method = editingMentorId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/mentors', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMentorId ? { id: editingMentorId, ...payload } : payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingMentorId ? 'Teacher profile updated successfully!' : 'New teacher profile created!', 'success');
        setEditingMentorId(null);
        setNewMentor({ name: '', role: '', subjectTaught: '', bio: '', experienceCredits: '', image: '', video: '', instagram: '#', linkedin: '#', behance: '#', website: '#', hidden: false });
        loadAllData();
      } else {
        showToast('Failed to save teacher profile', 'error');
      }
    } catch (error) {
      showToast('Failed to save teacher profile', 'error');
    }
  };

  // Delete Mentor
  const handleDeleteMentor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mentor?')) return;
    try {
      const res = await fetch(`/api/admin/mentors?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Mentor profile deleted successfully', 'success');
        loadAllData();
      } else {
        showToast('Failed to delete mentor profile', 'error');
      }
    } catch (error) {
      showToast('Failed to delete mentor profile', 'error');
    }
  };

  // Add / Edit FAQ
  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingFaqId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/faqs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaqId ? { id: editingFaqId, ...newFaq } : newFaq)
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingFaqId ? 'FAQ accordion updated!' : 'New FAQ added successfully!', 'success');
        setEditingFaqId(null);
        setNewFaq({ question: '', answer: '' });
        loadAllData();
      } else {
        showToast('Failed to save FAQ', 'error');
      }
    } catch (error) {
      showToast('Failed to save FAQ', 'error');
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('FAQ deleted successfully', 'success');
        loadAllData();
      } else {
        showToast('Failed to delete FAQ', 'error');
      }
    } catch (error) {
      showToast('Failed to delete FAQ', 'error');
    }
  };

  // Create Pricing Plan
  const handleCreatePricingPlan = async () => {
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Academic Pathway',
          description: 'A new pathways subscription program features overview description.',
          price: '$9,500',
          period: '/yr',
          features: ['Pathway academic course entry', 'Campus advisory access benefit'],
          isFeatured: false
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('New pricing pathway tier created!', 'success');
        loadAllData();
      } else {
        showToast('Failed to create pricing plan', 'error');
      }
    } catch (error) {
      showToast('Failed to create pricing plan', 'error');
    }
  };

  // Update Pricing Plan
  const handlePricingSubmit = async (plan: any) => {
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Pricing plan '${plan.name}' updated successfully!`, 'success');
        loadAllData();
      } else {
        showToast('Failed to update pricing plan', 'error');
      }
    } catch (error) {
      showToast('Failed to update pricing plan', 'error');
    }
  };

  // Delete Pricing Plan
  const handleDeletePricingPlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) return;
    try {
      const res = await fetch(`/api/admin/pricing?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast('Pricing plan tier deleted successfully', 'success');
        loadAllData();
      } else {
        showToast('Failed to delete pricing plan', 'error');
      }
    } catch (error) {
      showToast('Failed to delete pricing plan', 'error');
    }
  };

  // Add Curriculum Feature
  const handleAddFeature = async () => {
    try {
      const res = await fetch('/api/admin/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Feature Slot', videoUrl: '' })
      });
      const data = await res.json();
      if (data.success) {
        showToast('New curriculum feature slot added!', 'success');
        loadAllData();
      } else {
        showToast('Failed to add curriculum feature', 'error');
      }
    } catch (error) {
      showToast('Failed to add curriculum feature', 'error');
    }
  };

  // Update Curriculum Feature
  const handleFeatureSubmit = async (feature: any) => {
    try {
      const res = await fetch('/api/admin/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feature)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Curriculum feature updated successfully!', 'success');
        loadAllData();
      } else {
        showToast('Failed to update curriculum feature', 'error');
      }
    } catch (error) {
      showToast('Failed to update curriculum feature', 'error');
    }
  };

  // Delete Curriculum Feature
  const handleDeleteFeature = async (id: string) => {
    if (!confirm('Delete this feature slot?')) return;
    try {
      const res = await fetch(`/api/admin/features?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Feature slot deleted', 'success');
        loadAllData();
      } else {
        showToast('Failed to delete feature', 'error');
      }
    } catch (error) {
      showToast('Failed to delete feature', 'error');
    }
  };

  // Add Bento Gallery Item
  const handleAddBento = async () => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'IMAGE', url: '', size: 'SQUARE', altText: 'New Gallery Item', category: 'CLASSES' })
      });
      const data = await res.json();
      if (data.success) {
        showToast('New bento gallery slot added!', 'success');
        loadAllData();
      } else {
        showToast('Failed to add bento item', 'error');
      }
    } catch (error) {
      showToast('Failed to add bento item', 'error');
    }
  };

  // Update Bento Gallery Item
  const handleBentoSubmit = async (item: any) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Bento gallery slot updated successfully!', 'success');
        loadAllData();
      } else {
        showToast('Failed to update bento gallery slot', 'error');
      }
    } catch (error) {
      showToast('Failed to update bento gallery slot', 'error');
    }
  };

  // Delete Bento Gallery Item
  const handleDeleteBento = async (id: string) => {
    if (!confirm('Delete this bento slot?')) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Bento gallery slot deleted', 'success');
        loadAllData();
      } else {
        showToast('Failed to delete bento item', 'error');
      }
    } catch (error) {
      showToast('Failed to delete bento item', 'error');
    }
  };

  // Save All Curriculum Features (executed sequentially to avoid file lock race conditions)
  const handleSaveAllFeatures = async () => {
    showToast('Saving curriculum features...', 'success');
    try {
      for (let i = 0; i < curriculumFeatures.length; i++) {
        const feat = curriculumFeatures[i];
        await fetch('/api/admin/features', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...feat, order: i })
        });
      }
      showToast('All curriculum features saved successfully!', 'success');
      loadAllData();
    } catch (error) {
      showToast('Failed to save features', 'error');
    }
  };

  // Save All Bento Slots (executed sequentially to avoid file lock race conditions)
  const handleSaveAllBento = async () => {
    showToast('Saving bento gallery...', 'success');
    try {
      for (let i = 0; i < gallery.length; i++) {
        const item = gallery[i];
        await fetch('/api/admin/gallery', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, order: i })
        });
      }
      showToast('All bento gallery slots saved successfully!', 'success');
      loadAllData();
    } catch (error) {
      showToast('Failed to save bento slots', 'error');
    }
  };

  // Save All Pricing Plans (executed sequentially to avoid file lock race conditions)
  const handleSaveAllPricing = async () => {
    showToast('Saving pricing plans...', 'success');
    try {
      for (let i = 0; i < pricing.length; i++) {
        const plan = pricing[i];
        await fetch('/api/admin/pricing', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...plan, order: i })
        });
      }
      showToast('All pricing plans saved successfully!', 'success');
      loadAllData();
    } catch (error) {
      showToast('Failed to save pricing plans', 'error');
    }
  };

  // Save All Mentors (executed sequentially to avoid file lock race conditions)
  const handleSaveAllMentors = async () => {
    showToast('Saving mentors...', 'success');
    try {
      for (let i = 0; i < mentors.length; i++) {
        const m = mentors[i];
        // Ensure nested structure values are flattened or passed cleanly
        const payload = {
          id: m.id,
          name: m.name,
          role: m.role,
          image: m.image,
          bio: m.bio,
          video: m.video,
          socials: m.socials,
          order: i
        };
        await fetch('/api/admin/mentors', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      showToast('All mentors saved successfully!', 'success');
      loadAllData();
    } catch (error) {
      showToast('Failed to save mentors', 'error');
    }
  };

  // Add / Edit Testimonial
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingTestimonialId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonialId ? { id: editingTestimonialId, ...newTestimonial } : newTestimonial)
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingTestimonialId ? 'Testimonial updated!' : 'New testimonial added!', 'success');
        setEditingTestimonialId(null);
        setNewTestimonial({ quote: '', author: '', role: '' });
        loadAllData();
      } else {
        showToast('Failed to save testimonial', 'error');
      }
    } catch (error) {
      showToast('Failed to save testimonial', 'error');
    }
  };

  // Delete Testimonial
  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Testimonial deleted successfully', 'success');
        loadAllData();
      } else {
        showToast('Failed to delete testimonial', 'error');
      }
    } catch (error) {
      showToast('Failed to delete testimonial', 'error');
    }
  };

  // Logout Admin
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsLoggedIn(false);
      showToast('Logged out successfully', 'success');
    } catch (err) {
      document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setIsLoggedIn(false);
    }
  };

  // Get Unique Customers from applicants and transaction lists
  const getUniqueCustomers = () => {
    const customersMap = new Map<string, { name: string; email: string }>();
    applications.forEach(a => {
      if (a.email) {
        customersMap.set(a.email.toLowerCase().trim(), { name: a.fullName, email: a.email.trim() });
      }
    });
    transactions.forEach(t => {
      if (t.email) {
        customersMap.set(t.email.toLowerCase().trim(), { name: t.cardName, email: t.email.trim() });
      }
    });
    return Array.from(customersMap.values());
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmails.length === 0) {
      showToast('Please select at least one recipient email', 'error');
      return;
    }
    if (!campaignSubject.trim() || !campaignHeaderTitle.trim() || !campaignBodyText.trim()) {
      showToast('Subject, Header Title, and Message Body are required', 'error');
      return;
    }

    setIsSendingCampaign(true);
    setCampaignSendProgress(`Broadcasting campaign to ${selectedEmails.length} recipients...`);

    try {
      const res = await fetch('/api/admin/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: selectedEmails,
          subject: campaignSubject,
          headerTitle: campaignHeaderTitle,
          bodyText: campaignBodyText,
          ctaLabel: campaignCtaLabel,
          ctaUrl: campaignCtaUrl,
          headerImage: campaignHeaderImage
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Campaign broadcast completed successfully!', 'success');
        setCampaignSubject('');
        setCampaignHeaderTitle('');
        setCampaignBodyText('');
        setCampaignCtaLabel('');
        setCampaignCtaUrl('');
        setCampaignHeaderImage('');
        setSelectedEmails([]);
      } else {
        showToast(data.error || 'Failed to send campaign', 'error');
      }
    } catch (err) {
      showToast('Connection error during campaign broadcast', 'error');
    } finally {
      setIsSendingCampaign(false);
      setCampaignSendProgress('');
    }
  };

  // WhatsApp Settings Handlers
  const handleSaveWhatsappSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(whatsappSettings)
      });
      const data = await res.json();
      if (data.success) {
        setWhatsappSettings(data.settings);
        showToast('WhatsApp engine configuration saved!', 'success');
      } else {
        showToast('Failed to save WhatsApp settings', 'error');
      }
    } catch (err) {
      showToast('Error connecting to WhatsApp API', 'error');
    }
  };

  const handleSendWhatsappTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappTestTo || !whatsappTestMsg) {
      showToast('Recipient phone number and message are required', 'error');
      return;
    }
    setIsSendingWhatsappTest(true);
    try {
      const res = await fetch('/api/admin/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          to: whatsappTestTo,
          message: whatsappTestMsg
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.simulated ? 'Test WhatsApp simulated successfully!' : 'Test WhatsApp sent successfully!', 'success');
        setWhatsappTestMsg('');
        loadAllData();
      } else {
        showToast(data.error || 'Failed to send WhatsApp alert', 'error');
      }
    } catch (err) {
      showToast('Error connecting to WhatsApp API', 'error');
    } finally {
      setIsSendingWhatsappTest(false);
    }
  };

  // Student Portfolio & Assessment Handlers
  const handleSaveStudentPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPortfolio) return;
    setIsSavingPortfolio(true);
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedStudentForPortfolio.id,
          rating: studentPortfolioRating,
          notes: studentPortfolioNotes,
          photos: studentPortfolioPhotos
        })
      });
      const data = await res.json();
      if (data.success) {
        // Update applications list with new student details
        setApplications(prev => prev.map(app => app.id === selectedStudentForPortfolio.id ? data.data : app));
        setSelectedStudentForPortfolio(null);
        showToast('Student portfolio & grading saved successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to save student portfolio', 'error');
      }
    } catch (err) {
      showToast('Error connecting to portfolio API', 'error');
    } finally {
      setIsSavingPortfolio(false);
    }
  };

  // Core Subjects CMS Handlers
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ title: '', icon: 'star', desc: '' });

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.title || !newSubject.desc) {
      showToast('Title and description are required', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject)
      });
      const data = await res.json();
      if (data.success) {
        showToast('New Core Subject added successfully!', 'success');
        setNewSubject({ title: '', icon: 'star', desc: '' });
        setIsAddingSubject(false);
        loadAllData();
      } else {
        showToast(data.error || 'Failed to create subject', 'error');
      }
    } catch (err) {
      showToast('Error connecting to subjects API', 'error');
    }
  };

  const handleDeleteSubject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/subjects?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        if (selectedSubject?.id === id) setSelectedSubject(null);
        showToast('Subject deleted successfully', 'success');
        loadAllData();
      } else {
        showToast(data.error || 'Failed to delete subject', 'error');
      }
    } catch (err) {
      showToast('Error connecting to subjects API', 'error');
    }
  };

  const handleMoveSubject = async (index: number, direction: 'UP' | 'DOWN') => {
    const newIndex = direction === 'UP' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= coreSubjects.length) return;

    const newList = [...coreSubjects];
    const [moved] = newList.splice(index, 1);
    newList.splice(newIndex, 0, moved);

    setCoreSubjects(newList);
    const orderedIds = newList.map(s => s.id);

    try {
      const res = await fetch('/api/admin/subjects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Subject sequence updated!', 'success');
      } else {
        loadAllData();
      }
    } catch (err) {
      loadAllData();
    }
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;
    try {
      const response = await fetch('/api/admin/subjects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedSubject)
      });
      const data = await response.json();
      if (data.success) {
        setSelectedSubject(null);
        showToast('Core Subject updated successfully!', 'success');
        loadAllData();
      } else {
        showToast(data.error || 'Failed to update subject', 'error');
      }
    } catch (err) {
      showToast('Error connecting to subjects API', 'error');
    }
  };

  // Student Journey CMS Handlers
  const handleSaveJourneyStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJourneyStep) return;
    try {
      const response = await fetch('/api/admin/journey', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedJourneyStep)
      });
      const data = await response.json();
      if (data.success) {
        setSelectedJourneyStep(null);
        showToast('Journey Step updated successfully!', 'success');
        loadAllData();
      } else {
        showToast(data.error || 'Failed to update step', 'error');
      }
    } catch (err) {
      showToast('Error connecting to journey API', 'error');
    }
  };

  // Global Settings CMS Handlers
  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(globalSettings)
      });
      const data = await response.json();
      if (data.success) {
        showToast('Global support settings updated successfully!', 'success');
        loadAllData();
      } else {
        showToast(data.error || 'Failed to update global settings', 'error');
      }
    } catch (err) {
      showToast('Error connecting to settings API', 'error');
    }
  };

  const handleSaveAboutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutSettings)
      });
      const data = await response.json();
      if (data.success) {
        showToast('About page settings updated successfully!', 'success');
        loadAllData();
      } else {
        showToast(data.error || 'Failed to update about page settings', 'error');
      }
    } catch (err) {
      showToast('Error connecting to about page settings API', 'error');
    }
  };

  const openPortfolioEditor = (student: any) => {
    setSelectedStudentForPortfolio(student);
    setStudentPortfolioRating(student.evaluationRating || 0);
    setStudentPortfolioNotes(student.evaluationNotes || '');
    setStudentPortfolioPhotos(student.portfolioPhotos || []);
  };

  const openStudentProfileView = (student: any) => {
    setSelectedStudentForView(student);
  };

  // Render loading screen while auth is checking
  if (isAuthChecking) {
    return (
      <div className={styles.loginContainer} style={{ flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
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
          <p style={{ color: '#666', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
            Securing Connection...
          </p>
        </div>
      </div>
    );
  }

  // Render Login view
  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.logoWrapper} style={{ marginBottom: '32px' }}>
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
          <h2 className={styles.loginTitle}>Admin Collective Portal</h2>
          <p className={styles.loginSubtitle}>Access control database dashboard</p>
          
          <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                type="email" 
                id="email" 
                required 
                placeholder="admin@marse-academy.com" 
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                type="password" 
                id="password" 
                required 
                placeholder="••••••••" 
              />
            </div>
            {loginError && <p className={styles.errorText}>{loginError}</p>}
            <button type="submit" className={styles.loginBtn}>Verify Identity</button>
          </form>
        </div>
      </div>
    );
  }

  // Helper to filter financial transactions
  const getFilteredTransactions = () => {
    const now = new Date();
    
    return transactions.filter(t => {
      // 1. Filter by time
      const tDate = new Date(t.createdAt);
      let matchesTime = true;
      
      if (financeFilter === 'TODAY') {
        matchesTime = tDate.toDateString() === now.toDateString();
      } else if (financeFilter === 'WEEK') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesTime = tDate >= oneWeekAgo;
      } else if (financeFilter === 'MONTH') {
        matchesTime = tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      } else if (financeFilter === 'YEAR') {
        matchesTime = tDate.getFullYear() === now.getFullYear();
      } else if (financeFilter === 'CUSTOM') {
        if (dateFrom) {
          const from = new Date(dateFrom);
          from.setHours(0, 0, 0, 0);
          if (tDate < from) matchesTime = false;
        }
        if (dateTo && matchesTime) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          if (tDate > to) matchesTime = false;
        }
      }
      
      // 2. Filter by search
      let matchesSearch = true;
      if (financeSearch.trim()) {
        const query = financeSearch.toLowerCase();
        matchesSearch = 
          t.email.toLowerCase().includes(query) ||
          t.cardName.toLowerCase().includes(query) ||
          t.planName.toLowerCase().includes(query);
      }
      
      return matchesTime && matchesSearch;
    });
  };

  const filteredTxList = getFilteredTransactions();
  
  const filteredRevenue = filteredTxList.reduce((acc, t) => {
    const num = parseInt(t.amount.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + num;
  }, 0);
  
  const filteredCount = filteredTxList.length;
  const filteredAOV = filteredCount > 0 ? Math.round(filteredRevenue / filteredCount) : 0;

  // Plan breakdown for statistics
  const planBreakdown = filteredTxList.reduce((acc: any, t) => {
    const name = t.planName;
    const amt = parseInt(t.amount.replace(/[^0-9]/g, ''), 10) || 0;
    if (!acc[name]) {
      acc[name] = { count: 0, revenue: 0 };
    }
    acc[name].count += 1;
    acc[name].revenue += amt;
    return acc;
  }, {});

  return (
    <div className={`${styles.dashboardLayout} ${isLightMode ? styles.lightMode : ''}`}>
      
      {/* Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${!isSidebarVisible ? styles.sidebarHidden : ''}`}>
        <div className={styles.sidebarBrand}>
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
          <div style={{ marginLeft: '12px' }}>
            <p style={{ margin: 0, fontSize: '9px', letterSpacing: '0.12em', color: '#888', textTransform: 'uppercase' }}>Admin Operations</p>
          </div>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button onClick={() => setActiveTab('dashboard')} className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.activeNav : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            Dashboard
          </button>
          <button onClick={() => setActiveTab('finance')} className={`${styles.navItem} ${activeTab === 'finance' ? styles.activeNav : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Finance & Billing
          </button>
          <button onClick={() => setActiveTab('applications')} className={`${styles.navItem} ${activeTab === 'applications' ? styles.activeNav : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Applications
          </button>
          <button onClick={() => setActiveTab('cohorts')} className={`${styles.navItem} ${activeTab === 'cohorts' ? styles.activeNav : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Classes & Cohorts
          </button>
          <button onClick={() => setActiveTab('attendance')} className={`${styles.navItem} ${activeTab === 'attendance' ? styles.activeNav : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            Attendance Tracker
          </button>

          {/* Website Content collapsible menu */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <button 
              onClick={() => setCmsDropdownOpen(!cmsDropdownOpen)} 
              className={styles.navItem}
              style={{ justifyContent: 'space-between', width: '100%' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>
                Website Content CMS
              </span>
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{ 
                  transform: cmsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease'
                }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {cmsDropdownOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: '1px solid rgba(255,255,255,0.06)', marginLeft: '12px', paddingLeft: '4px', gap: '4px', margin: '4px 0 12px 12px' }}>
                <button onClick={() => setActiveTab('hero')} className={`${styles.navItem} ${activeTab === 'hero' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  Hero Section
                </button>
                <button onClick={() => setActiveTab('contact')} className={`${styles.navItem} ${activeTab === 'contact' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  Contact Page
                </button>
                <button onClick={() => setActiveTab('about')} className={`${styles.navItem} ${activeTab === 'about' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  About Us Page
                </button>
                <button onClick={() => setActiveTab('features')} className={`${styles.navItem} ${activeTab === 'features' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  Curriculum Features
                </button>
                <button onClick={() => setActiveTab('programs')} className={`${styles.navItem} ${activeTab === 'programs' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  Programs Showcase (5 Columns)
                </button>
                <button onClick={() => setActiveTab('bento')} className={`${styles.navItem} ${activeTab === 'bento' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  Gallery Settings (/gallery)
                </button>
                <button onClick={() => setActiveTab('mentors')} className={`${styles.navItem} ${activeTab === 'mentors' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  Mentors profiles
                </button>
                <button onClick={() => setActiveTab('subjects')} className={`${styles.navItem} ${activeTab === 'subjects' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  Core Subjects (13)
                </button>
                <button onClick={() => setActiveTab('journey')} className={`${styles.navItem} ${activeTab === 'journey' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  Student Journey
                </button>
                <button onClick={() => setActiveTab('pricing')} className={`${styles.navItem} ${activeTab === 'pricing' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  Pricing Plans
                </button>
                <button onClick={() => setActiveTab('faqs')} className={`${styles.navItem} ${activeTab === 'faqs' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  FAQs Accordion
                </button>
                <button onClick={() => setActiveTab('testimonials')} className={`${styles.navItem} ${activeTab === 'testimonials' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  Student Testimonials
                </button>
                <button onClick={() => setActiveTab('settings')} className={`${styles.navItem} ${activeTab === 'settings' ? styles.activeNav : ''}`} style={{ fontSize: '13px', padding: '10px 16px' }}>
                  Global Settings CMS
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setActiveTab('staff')} className={`${styles.navItem} ${activeTab === 'staff' ? styles.activeNav : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="17" y1="11" x2="23" y2="11" /></svg>
            Staff & Roles
          </button>
          <button onClick={() => setActiveTab('whatsapp')} className={`${styles.navItem} ${activeTab === 'whatsapp' ? styles.activeNav : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            WhatsApp Engine
          </button>
          <button onClick={() => setActiveTab('elcaptain')} className={`${styles.navItem} ${activeTab === 'elcaptain' ? styles.activeNav : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/></svg>
            Elcaptain Email System
          </button>
        </nav>

        <button 
          onClick={() => setIsLightMode(!isLightMode)} 
          className={styles.themeToggleBtn}
        >
          <span className={styles.themeToggleIcon}>{isLightMode ? '🌙' : '☀️'}</span>
          <span>{isLightMode ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        <button 
          onClick={handleLogout} 
          className={styles.logoutBtn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Exit Panel
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={`${styles.mainContent} ${!isSidebarVisible ? styles.mainContentExpanded : ''}`}>
        
        {/* TOP STATUS BAR */}
        <header className={styles.contentHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                borderRadius: '6px',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              title={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
            >
              {isSidebarVisible ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <path d="M16 15l-3-3 3-3" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <path d="M13 9l3 3-3 3" />
                </svg>
              )}
            </button>
            <h2 style={{ margin: 0 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={loadAllData} 
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              title="Refresh all data from database"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
              Refresh
            </button>
            <div className={styles.systemStatus}>
              <span className={styles.pulseDot}></span> Live System
            </div>
          </div>
        </header>

        {/* 1. DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className={styles.panel}>
            {/* Stats Cards Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statsCard}>
                <div className={styles.statsIconWrapper}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div>
                  <h4>Total Applications</h4>
                  <h3>{totalApplications}</h3>
                </div>
              </div>
              <div className={styles.statsCard}>
                <div className={styles.statsIconWrapper}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                </div>
                <div>
                  <h4>Total Revenue</h4>
                  <h3>${totalEarnings.toLocaleString()}</h3>
                </div>
              </div>
              <div className={styles.statsCard}>
                <div className={styles.statsIconWrapper}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <div>
                  <h4>Active Mentors</h4>
                  <h3>{mentors.length}</h3>
                </div>
              </div>
            </div>

            {/* 2. ANALYTICS CHARTS SECTION */}
            {(() => {
              // Calculate monthly revenue
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const sums = new Array(12).fill(0);
              transactions.forEach(t => {
                const val = parseInt(t.amount.replace(/[^0-9]/g, ''), 10) || 0;
                const d = new Date(t.createdAt);
                if (!isNaN(d.getTime())) {
                  sums[d.getMonth()] += val;
                }
              });
              const monthlyRevenueData = months.map((m, i) => ({ month: m, amount: sums[i] }));
              const maxRev = Math.max(...monthlyRevenueData.map(d => d.amount), 1000);
              const svgPoints = monthlyRevenueData.map((d, i) => {
                const x = 50 + (i * 35); // Distributed width
                const y = 170 - ((d.amount / maxRev) * 130); // Scaled height
                return { x, y, label: d.month, value: d.amount };
              });
              const pathD = svgPoints.length > 0 
                ? `M ${svgPoints[0].x} ${svgPoints[0].y} ` + svgPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
                : '';
              const areaD = svgPoints.length > 0
                ? `${pathD} L ${svgPoints[svgPoints.length - 1].x} 170 L ${svgPoints[0].x} 170 Z`
                : '';

              // Admissions Funnel
              const totalApplied = applications.length;
              const totalApproved = applications.filter(a => a.status === 'APPROVED').length;
              const totalWaitlisted = applications.filter(a => a.status === 'WAITING_LIST').length;
              const totalPaying = transactions.length;
              const funnelData = [
                { label: 'Total Applicants', count: totalApplied, color: '#a855f7', desc: 'Total registrations received' },
                { label: 'Approved Students', count: totalApproved, color: '#D4AF37', desc: 'Cleared academic board review' },
                { label: 'Waitlisted Queue', count: totalWaitlisted, color: '#f59e0b', desc: 'Deferred due to capacity limits' },
                { label: 'Active Subscriptions', count: totalPaying, color: '#10b981', desc: 'Finalized secure payment' }
              ];
              const maxFunnel = Math.max(...funnelData.map(d => d.count), 1);

              // Cohort Attendance Rates
              const cohortRates = cohorts.map(c => {
                const logs = attendanceLogs.filter(l => l.cohortId === c.id);
                if (logs.length === 0) return { name: c.name, rate: 0 };
                let total = 0;
                let present = 0;
                logs.forEach(l => {
                  if (l.records) {
                    l.records.forEach((r: any) => {
                      total++;
                      if (r.status === 'PRESENT' || r.status === 'EXCUSED') present++;
                    });
                  }
                });
                return { name: c.name, rate: total > 0 ? Math.round((present / total) * 100) : 0 };
              });

              return (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '24px',
                  margin: '28px 0',
                  color: '#ffffff'
                }}>
                  {/* Revenue Curve Card */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800', letterSpacing: '0.03em' }}>Monthly Captured Revenue</h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#666' }}>captured merchant accounts subscriptions (USD)</p>
                    
                    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                      <svg viewBox="0 0 460 200" width="100%" height="100%">
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grids */}
                        <line x1="50" y1="40" x2="435" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                        <line x1="50" y1="105" x2="435" y2="105" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                        <line x1="50" y1="170" x2="435" y2="170" stroke="rgba(255,255,255,0.1)" />
                        
                        {/* Area & Path */}
                        {pathD && <path d={areaD} fill="url(#areaGrad)" />}
                        {pathD && <path d={pathD} fill="none" stroke="#D4AF37" strokeWidth="2.5" />}

                        {/* Interactive Circles & Labels */}
                        {svgPoints.map((pt, i) => (
                          <g key={i}>
                            {pt.value > 0 && (
                              <>
                                <circle cx={pt.x} cy={pt.y} r="4" fill="#D4AF37" stroke="#000" strokeWidth="1.5" />
                                <text x={pt.x} y={pt.y - 8} textAnchor="middle" fill="#D4AF37" fontSize="9" fontWeight="bold">
                                  ${pt.value.toLocaleString()}
                                </text>
                              </>
                            )}
                            <text x={pt.x} y="186" textAnchor="middle" fill="#666" fontSize="9" fontWeight="600">
                              {pt.label}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Conversion Funnel Card */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800', letterSpacing: '0.03em' }}>Admissions Conversion Funnel</h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#666' }}>pipeline performance from application to payment</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1, justifyContent: 'center' }}>
                      {funnelData.map((fd, i) => {
                        const widthPct = totalApplied > 0 ? Math.round((fd.count / maxFunnel) * 100) : 0;
                        return (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                              <span style={{ fontWeight: '700', color: '#ffffff' }}>{fd.label}</span>
                              <span style={{ fontWeight: '800', color: fd.color }}>{fd.count} students ({widthPct}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${widthPct}%`, height: '100%', background: fd.color, borderRadius: '4px', transition: 'width 0.8s ease' }}></div>
                            </div>
                            <span style={{ fontSize: '10px', color: '#555' }}>{fd.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Attendance Performance Card */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800', letterSpacing: '0.03em' }}>Cohort Attendance Rates</h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#666' }}>average attendance level per active term</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flexGrow: 1, maxHeight: '200px' }}>
                      {cohortRates.length === 0 ? (
                        <p style={{ color: '#555', fontSize: '12px', textAlign: 'center', margin: 'auto' }}>No cohorts registered.</p>
                      ) : (
                        cohortRates.map((cr, idx) => {
                          let rateColor = '#ef4444'; // Red for low attendance
                          if (cr.rate >= 90) rateColor = '#10b981'; // Green for excellent
                          else if (cr.rate >= 75) rateColor = '#D4AF37'; // Gold for good
                          else if (cr.rate >= 50) rateColor = '#f59e0b'; // Orange for average

                          return (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px 14px' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `2.5px solid ${rateColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#ffffff' }}>{cr.rate}%</span>
                              </div>
                              <div style={{ minWidth: 0, flexGrow: 1 }}>
                                <h4 style={{ margin: '0 0 2px 0', fontSize: '12.5px', fontWeight: '700', color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{cr.name}</h4>
                                <span style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                  {cr.rate >= 90 ? 'Outstanding Presence' : cr.rate >= 75 ? 'Optimal Presence' : cr.rate >= 50 ? 'Requires attention' : 'Critical Attendance'}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Recent Payments Section */}
            <div className={styles.dataSection}>
              <h3>Recent Billing Transactions</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Card Name</th>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '24px 0' }}>No billing transactions registered yet.</td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td>{tx.email}</td>
                          <td>{tx.cardName}</td>
                          <td>{tx.planName}</td>
                          <td style={{ fontWeight: 'bold' }}>{tx.amount}</td>
                          <td><span className={styles.statusBadgeApproved}>{tx.status}</span></td>
                          <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 1.5 FINANCE & BILLING VIEW */}
        {activeTab === 'finance' && (
          <div className={styles.panel}>

            {/* Finance Header with Live Indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Finance & Billing</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>Complete financial analytics with live data sync</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '20px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live — Updates every 7s</span>
              </div>
            </div>

            {/* Filter controls row */}
            <div style={{
              display: 'flex', 
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '28px',
              borderBottom: '1px solid #111111',
              paddingBottom: '20px'
            }}>
              {/* Top row: Quick filters + Search */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                {/* Quick Range Filters */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(['ALL', 'TODAY', 'WEEK', 'MONTH', 'YEAR', 'CUSTOM'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setFinanceFilter(filter)}
                      style={{
                        backgroundColor: financeFilter === filter ? '#ffffff' : 'transparent',
                        color: financeFilter === filter ? '#000000' : '#888888',
                        border: '1px solid',
                        borderColor: financeFilter === filter ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '7px 14px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      {filter === 'CUSTOM' && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      )}
                      {filter === 'ALL' ? 'All Time' :
                       filter === 'TODAY' ? 'Today' :
                       filter === 'WEEK' ? 'This Week' :
                       filter === 'MONTH' ? 'This Month' :
                       filter === 'YEAR' ? 'This Year' :
                       'Custom Range'}
                    </button>
                  ))}
                </div>

                {/* Search input */}
                <div style={{ position: 'relative', width: '260px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search email, cardholder, plan..."
                    value={financeSearch}
                    onChange={(e) => setFinanceSearch(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      padding: '8px 12px 8px 32px',
                      fontSize: '13px',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Custom Date Range Row — slides in when CUSTOM is selected */}
              {financeFilter === 'CUSTOM' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  flexWrap: 'wrap'
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span style={{ fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Range</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <label style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>From</label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '6px',
                          padding: '7px 10px',
                          fontSize: '12px',
                          color: '#ffffff',
                          outline: 'none',
                          colorScheme: 'dark'
                        }}
                      />
                    </div>
                    <svg width="16" height="2" viewBox="0 0 16 2" fill="none"><line x1="0" y1="1" x2="16" y2="1" stroke="#444" strokeWidth="2"/></svg>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <label style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>To</label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '6px',
                          padding: '7px 10px',
                          fontSize: '12px',
                          color: '#ffffff',
                          outline: 'none',
                          colorScheme: 'dark'
                        }}
                      />
                    </div>
                  </div>
                  {(dateFrom || dateTo) && (
                    <button
                      onClick={() => { setDateFrom(''); setDateTo(''); }}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,100,100,0.2)',
                        color: '#f87171',
                        borderRadius: '5px',
                        padding: '5px 10px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Clear Dates
                    </button>
                  )}
                  {dateFrom && dateTo && (
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>
                      Showing: {new Date(dateFrom).toLocaleDateString()} → {new Date(dateTo).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Financial indicators cards */}
            <div className={styles.statsGrid} style={{ marginBottom: '32px' }}>
              <div className={styles.statsCard}>
                <div className={styles.statsIconWrapper} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div>
                  <h4 style={{ color: '#888888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue ({financeFilter})</h4>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>${filteredRevenue.toLocaleString()}</h3>
                </div>
              </div>

              <div className={styles.statsCard}>
                <div className={styles.statsIconWrapper} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                </div>
                <div>
                  <h4 style={{ color: '#888888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sales Volume</h4>
                  <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{filteredCount} Payments</h3>
                </div>
              </div>

              <div className={styles.statsCard}>
                <div className={styles.statsIconWrapper} style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <div>
                  <h4 style={{ color: '#888888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Order Value</h4>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#D4AF37' }}>${filteredAOV.toLocaleString()}</h3>
                </div>
              </div>
            </div>

            {/* Split Content Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.2fr', gap: '32px', alignItems: 'start' }}>
              {/* Transactions Ledger */}
              <div className={styles.dataSection} style={{ margin: 0 }}>
                <h3>Transactions Ledger ({filteredCount} matched)</h3>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Customer Email</th>
                        <th>Name</th>
                        <th>Academy Pathway</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTxList.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '32px 0', color: '#666' }}>No transactions found for the selected criteria.</td>
                        </tr>
                      ) : (
                        filteredTxList.map((tx) => (
                          <tr key={tx.id}>
                            <td>{tx.email}</td>
                            <td>{tx.cardName}</td>
                            <td>{tx.planName}</td>
                            <td style={{ fontWeight: 'bold', color: '#10b981' }}>{tx.amount}</td>
                            <td>
                              <span style={{
                                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                                color: '#10b981',
                                border: '1px solid rgba(16, 185, 129, 0.15)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '700'
                              }}>
                                {tx.status}
                              </span>
                            </td>
                            <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Plan breakdown charts panel */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h4 style={{ margin: '0 0 20px 0', fontSize: '14px', fontFamily: 'Manrope', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue Breakdown</h4>
                
                {Object.keys(planBreakdown).length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>No revenue sales recorded in this interval.</p>
                ) : (
                  Object.keys(planBreakdown).map(planName => {
                    const stats = planBreakdown[planName];
                    const percentage = filteredRevenue > 0 ? Math.round((stats.revenue / filteredRevenue) * 100) : 0;
                    return (
                      <div key={planName} style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#fff' }}>
                          <span>{planName} ({stats.count} sales)</span>
                          <span style={{ fontWeight: '700', color: '#D4AF37' }}>${stats.revenue.toLocaleString()} ({percentage}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#D4AF37', borderRadius: '9999px', transition: 'width 0.4s ease' }}></div>
                        </div>
                      </div>
                    );
                  })
                )}

                <div style={{
                  marginTop: '32px',
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '12px',
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span style={{ color: '#aaa', fontWeight: '600' }}>Gateway Connection Encrypted</span>
                  </div>
                  All transactions are logged via secure checkout logs and mapped to local databases in real time.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. APPLICATIONS MANAGEMENT */}
        {activeTab === 'applications' && (
          <div className={styles.panel}>
            <div className={styles.dataSection}>
              <h3>Admission Applications</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Education</th>
                      <th>Interests</th>
                      <th>Guardian Info</th>
                      <th>Assigned Class</th>
                      <th>Consents</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={11} style={{ textAlign: 'center', padding: '24px 0' }}>No student applications found.</td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app.id}>
                          <td style={{ cursor: 'pointer' }} onClick={() => openStudentProfileView(app)}>
                            {app.photo ? (
                              <img src={app.photo} alt="Student" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'border-color 0.2s' }} />
                            ) : (
                              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#444' }}>person</span>
                            )}
                          </td>
                          <td 
                            style={{ fontWeight: 'bold', cursor: 'pointer', color: '#D4AF37', textDecoration: 'underline', textUnderlineOffset: '3px' }} 
                            onClick={() => openStudentProfileView(app)}
                          >
                            {app.fullName}
                          </td>
                          <td>{app.email}</td>
                          <td>{app.phone || 'N/A'}</td>
                          <td>{app.educationLevel}</td>
                          <td>{app.interests.join(', ')}</td>
                          <td>
                            {app.guardianName ? (
                              <div style={{ fontSize: '12px' }}>
                                <strong>{app.guardianName}</strong><br/>
                                {app.guardianEmail} • {app.guardianPhone}
                              </div>
                            ) : 'N/A'}
                          </td>
                          <td>
                            <select 
                              value={app.cohortId || ''} 
                              onChange={(e) => handleAssignStudentCohort(app.id, e.target.value)}
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '4px',
                                color: '#fff',
                                padding: '4px 8px',
                                fontSize: '12px',
                                outline: 'none',
                                cursor: 'pointer',
                                width: '130px'
                              }}
                            >
                              <option value="" style={{ background: '#0a0a0a' }}>Unassigned</option>
                              {cohorts.map(c => (
                                <option key={c.id} value={c.id} style={{ background: '#0a0a0a' }}>{c.name}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span style={{ color: app.termsAccepted !== false ? '#10b981' : '#ef4444' }}>
                                {app.termsAccepted !== false ? '✓' : '✗'} Terms
                              </span>
                              <span style={{ color: app.mediaConsent !== false ? '#10b981' : '#ef4444' }}>
                                {app.mediaConsent !== false ? '✓' : '✗'} Media
                              </span>
                              <span style={{ color: app.medicalConsent !== false ? '#10b981' : '#ef4444' }}>
                                {app.medicalConsent !== false ? '✓' : '✗'} Medical
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className={
                              app.status === 'APPROVED' ? styles.statusBadgeApproved :
                              app.status === 'PENDING' ? styles.statusBadgePending :
                              styles.statusBadgeRejected
                            }
                            style={app.status === 'WAITING_LIST' ? {
                              backgroundColor: 'rgba(245, 158, 11, 0.08)',
                              color: '#f59e0b',
                              border: '1px solid rgba(245, 158, 11, 0.15)'
                            } : {}}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button onClick={() => handleUpdateAppStatus(app.id, 'APPROVED')} className={styles.actionBtnApprove}>Approve</button>
                              <button onClick={() => handleUpdateAppStatus(app.id, 'CONTACTED')} className={styles.actionBtnContact}>Contacted</button>
                              <button onClick={() => handleUpdateAppStatus(app.id, 'WAITING_LIST')} className={styles.actionBtnContact} style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.15)' }}>Waitlist</button>
                              <button onClick={() => handleUpdateAppStatus(app.id, 'REJECTED')} className={styles.actionBtnReject}>Reject</button>
                              {app.status === 'APPROVED' && (
                                <>
                                  <button 
                                    onClick={() => {
                                      const pass = app.password || `Marse2026!${app.id ? app.id.slice(-3) : '789'}`;
                                      navigator.clipboard.writeText(pass);
                                      showToast(`Copied password "${pass}" to clipboard!`, 'success');
                                    }}
                                    className={styles.actionBtnContact} 
                                    style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.25)', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 'bold' }}
                                    title="Click to copy Password only"
                                  >
                                    🔑 {app.password || `Marse2026!${app.id ? app.id.slice(-3) : '789'}`}
                                  </button>
                                  <button 
                                    onClick={() => openPortfolioEditor(app)} 
                                    className={styles.actionBtnContact} 
                                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.08)', color: '#D4AF37', borderColor: 'rgba(212, 175, 55, 0.15)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                  >
                                    🎨 Portfolio
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. HERO CONFIG CMS */}
        {activeTab === 'hero' && (
          <div className={styles.panel}>
            <div className={styles.formCard} style={{ maxWidth: '600px' }}>
              <h3>Home Hero Settings</h3>
              <form onSubmit={handleHeroSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Hero Title Copy</label>
                  <textarea 
                    value={heroSettings.title} 
                    onChange={(e) => setHeroSettings((prev: any) => ({ ...prev, title: e.target.value }))} 
                    required
                    style={{ minHeight: '80px' }}
                  ></textarea>
                </div>
                <div className={styles.inputGroup}>
                  <label>Hero Description Copy</label>
                  <textarea 
                    value={heroSettings.description} 
                    onChange={(e) => setHeroSettings((prev: any) => ({ ...prev, description: e.target.value }))} 
                    required
                    style={{ minHeight: '120px' }}
                  ></textarea>
                </div>
                <div className={styles.inputGroup} style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#ffffff' }}>
                    <input 
                      type="radio" 
                      name="heroMediaType" 
                      checked={heroSettings.mediaType === 'VIDEO'} 
                      onChange={() => setHeroSettings((prev: any) => ({ ...prev, mediaType: 'VIDEO' }))} 
                      style={{ accentColor: '#D4AF37' }}
                    />
                    <span>Use Video Background</span>
                  </label>
                  <div className={styles.inputWithUpload} style={{ marginTop: '8px', opacity: heroSettings.mediaType === 'VIDEO' ? 1 : 0.6 }}>
                    <input 
                      value={heroSettings.videoUrl || ''} 
                      onChange={(e) => setHeroSettings((prev: any) => ({ ...prev, videoUrl: e.target.value }))} 
                      type="text" 
                      placeholder="e.g. /vienna-makeup-hair.mp4"
                      disabled={uploadingKey !== null}
                    />
                    <div className={styles.uploadWrapper}>
                      <input 
                        type="file" 
                        accept="video/*" 
                        id="hero-video-upload"
                        onChange={(e) => handleFileUpload(e, 'hero-video', (url) => setHeroSettings((prev: any) => ({ ...prev, videoUrl: url })))}
                        className={styles.fileInput}
                        disabled={uploadingKey !== null}
                      />
                      <label htmlFor="hero-video-upload" className={styles.btnUpload}>
                        {uploadingKey === 'hero-video' ? `Uploading ${uploadPercent}%` : 'Upload Video'}
                      </label>
                    </div>
                  </div>
                  {heroSettings.videoUrl && (
                    <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222', width: 'fit-content' }}>
                      <video src={heroSettings.videoUrl} width="160" height="90" controls muted style={{ display: 'block' }} />
                    </div>
                  )}
                </div>

                <div className={styles.inputGroup} style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#ffffff' }}>
                    <input 
                      type="radio" 
                      name="heroMediaType" 
                      checked={heroSettings.mediaType === 'IMAGE'} 
                      onChange={() => setHeroSettings((prev: any) => ({ ...prev, mediaType: 'IMAGE' }))} 
                      style={{ accentColor: '#D4AF37' }}
                    />
                    <span>Use Image Background</span>
                  </label>
                  <div className={styles.inputWithUpload} style={{ marginTop: '8px', opacity: heroSettings.mediaType === 'IMAGE' ? 1 : 0.6 }}>
                    <input 
                      value={heroSettings.imageUrl || ''} 
                      onChange={(e) => setHeroSettings((prev: any) => ({ ...prev, imageUrl: e.target.value }))} 
                      type="text" 
                      placeholder="e.g. /hero-model.png"
                      disabled={uploadingKey !== null}
                    />
                    <div className={styles.uploadWrapper}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="hero-image-upload"
                        onChange={(e) => handleFileUpload(e, 'hero-image', (url) => setHeroSettings((prev: any) => ({ ...prev, imageUrl: url })))}
                        className={styles.fileInput}
                        disabled={uploadingKey !== null}
                      />
                      <label htmlFor="hero-image-upload" className={styles.btnUpload}>
                        {uploadingKey === 'hero-image' ? `Uploading ${uploadPercent}%` : 'Upload Image'}
                      </label>
                    </div>
                  </div>
                  {heroSettings.imageUrl && (
                    <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222', width: 'fit-content' }}>
                      <img src={heroSettings.imageUrl} width="160" height="90" style={{ display: 'block', objectFit: 'cover' }} alt="Hero preview" />
                    </div>
                  )}
                </div>
                <div className={styles.inputGroup} style={{ marginTop: '20px', borderTop: '1px solid #111', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ margin: 0, fontWeight: '700' }}>Media Focal Point (Repositioning)</label>
                    <button 
                      type="button" 
                      onClick={() => setShowHeroPreview(true)}
                      style={{
                        background: 'rgba(212,175,55,0.1)',
                        border: '1px solid rgba(212,175,55,0.2)',
                        color: '#D4AF37',
                        borderRadius: '30px',
                        padding: '6px 14px',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>visibility</span>
                      👁️ Live Drag & Reposition Preview
                    </button>
                  </div>
                  
                  {/* X Alignment slider */}
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Horizontal Offset (Left ↔ Right)</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={parseInt(heroSettings.mediaPositionX || '50', 10)} 
                        onChange={(e) => setHeroSettings((prev: any) => ({ ...prev, mediaPositionX: e.target.value + '%' }))}
                        style={{ flex: 1, accentColor: '#D4AF37', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 'bold', width: '40px', textAlign: 'right' }}>
                        {heroSettings.mediaPositionX || '50%'}
                      </span>
                    </div>
                  </div>

                  {/* Y Alignment slider */}
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Vertical Offset (Top ↔ Bottom)</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={parseInt(heroSettings.mediaPositionY || '50', 10)} 
                        onChange={(e) => setHeroSettings((prev: any) => ({ ...prev, mediaPositionY: e.target.value + '%' }))}
                        style={{ flex: 1, accentColor: '#D4AF37', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 'bold', width: '40px', textAlign: 'right' }}>
                        {heroSettings.mediaPositionY || '50%'}
                      </span>
                    </div>
                  </div>

                  {/* Media Zoom slider */}
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Media Zoom / Scale</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <input 
                        type="range" 
                        min="1" 
                        max="2.5" 
                        step="0.05"
                        value={heroSettings.mediaScale || 1.0} 
                        onChange={(e) => setHeroSettings((prev: any) => ({ ...prev, mediaScale: parseFloat(e.target.value) }))}
                        style={{ flex: 1, accentColor: '#D4AF37', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 'bold', width: '40px', textAlign: 'right' }}>
                        {Number(heroSettings.mediaScale || 1.0).toFixed(2)}x
                      </span>
                    </div>
                  </div>

                  {/* Dark Overlay Opacity slider */}
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Dark Overlay Opacity</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <input 
                        type="range" 
                        min="0" 
                        max="0.95" 
                        step="0.05"
                        value={heroSettings.mediaOverlay !== undefined ? heroSettings.mediaOverlay : 0.4} 
                        onChange={(e) => setHeroSettings((prev: any) => ({ ...prev, mediaOverlay: parseFloat(e.target.value) }))}
                        style={{ flex: 1, accentColor: '#D4AF37', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 'bold', width: '40px', textAlign: 'right' }}>
                        {Math.round((heroSettings.mediaOverlay ?? 0.4) * 100)}%
                      </span>
                    </div>
                  </div>

                  <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#666', lineHeight: '1.5' }}>
                    Click the preview button above to open the Media Repositioner Workstation, or adjust the sliders manually.
                  </p>
                </div>
                <button type="submit" className={styles.btnSave} style={{ marginTop: '12px' }}>Save Global Hero Config</button>
              </form>
            </div>
          </div>
        )}

        {/* 4. CURRICULUM FEATURES CMS */}
        {activeTab === 'features' && (
          <div className={styles.panel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #111', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Curriculum Features</h3>
                <span style={{ fontSize: '11px', color: '#888', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
                  ↕ Drag cards to reorder
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSaveAllFeatures} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  ✓ Save All Settings
                </button>
                <button onClick={handleAddFeature} className={styles.btnCreatePlan}>+ Add New Feature Slot</button>
              </div>
            </div>
            <div className={styles.pricingEditorGrid}>
              {curriculumFeatures.map((feat, index) => (
                <div 
                  key={feat.id} 
                  className={styles.formCard}
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", index.toString());
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
                    const hoverIndex = index;
                    if (dragIndex === hoverIndex) return;
                    const updated = [...curriculumFeatures];
                    const [draggedItem] = updated.splice(dragIndex, 1);
                    updated.splice(hoverIndex, 0, draggedItem);
                    setCurriculumFeatures(updated);
                    showToast('Swapped features. Click Save All to apply changes!', 'success');
                  }}
                  style={{ cursor: 'move', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>Slot #{index + 1}</h4>
                    </div>
                    <button onClick={() => handleDeleteFeature(feat.id)} className={styles.listDeleteBtn} style={{ fontSize: '11px', padding: '4px 10px' }}>Delete</button>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Feature Title</label>
                    <input 
                      value={feat.title} 
                      onChange={(e) => {
                        const title = e.target.value;
                        setCurriculumFeatures(prev => prev.map(f => f.id === feat.id ? { ...f, title } : f));
                      }}
                      type="text" 
                      required 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Hover Video URL</label>
                    <div className={styles.inputWithUpload}>
                      <input 
                        value={feat.videoUrl} 
                        onChange={(e) => {
                          const videoUrl = e.target.value;
                          setCurriculumFeatures(prev => prev.map(f => f.id === feat.id ? { ...f, videoUrl } : f));
                        }}
                        type="text" 
                        required 
                        disabled={uploadingKey !== null}
                      />
                      <div className={styles.uploadWrapper}>
                        <input 
                          type="file" 
                          accept="video/*" 
                          id={`feat-video-${feat.id}`}
                          onChange={(e) => handleFileUpload(e, feat.id, (url) => {
                            setCurriculumFeatures(prev => prev.map(f => f.id === feat.id ? { ...f, videoUrl: url } : f));
                          })}
                          className={styles.fileInput}
                          disabled={uploadingKey !== null}
                        />
                        <label htmlFor={`feat-video-${feat.id}`} className={styles.btnUpload}>
                          {uploadingKey === feat.id ? `Uploading ${uploadPercent}%` : 'Upload Video'}
                        </label>
                      </div>
                    </div>
                    {feat.videoUrl && (
                      <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222', width: 'fit-content' }}>
                        <video src={feat.videoUrl} width="160" height="90" controls muted style={{ display: 'block' }} />
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleFeatureSubmit(feat)} className={styles.btnSave}>Save Feature</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. BENTO GALLERY CMS */}
        {activeTab === 'bento' && (
          <div className={styles.panel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #111', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Gallery Settings (/gallery)</h3>
                <span style={{ fontSize: '11px', color: '#888', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
                  ↕ Drag cards to reorder
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSaveAllBento} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  ✓ Save All Settings
                </button>
                <button onClick={handleAddBento} className={styles.btnCreatePlan}>+ Add New Bento Slot</button>
              </div>
            </div>
            <div className={styles.pricingEditorGrid}>
              {gallery.map((item, index) => (
                <div 
                  key={item.id} 
                  className={styles.formCard}
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", index.toString());
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
                    const hoverIndex = index;
                    if (dragIndex === hoverIndex) return;
                    const updated = [...gallery];
                    const [draggedItem] = updated.splice(dragIndex, 1);
                    updated.splice(hoverIndex, 0, draggedItem);
                    setGallery(updated);
                    showToast('Swapped gallery items. Click Save All to apply changes!', 'success');
                  }}
                  style={{ cursor: 'move', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>Slot #{index + 1}</h4>
                    </div>
                    <button onClick={() => handleDeleteBento(item.id)} className={styles.listDeleteBtn} style={{ fontSize: '11px', padding: '4px 10px' }}>Delete</button>
                  </div>
                  <div className={styles.inputRow} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className={styles.inputGroup}>
                      <label>Media Type</label>
                      <select 
                        value={item.type} 
                        onChange={(e) => {
                          const type = e.target.value;
                          setGallery(prev => prev.map(g => g.id === item.id ? { ...g, type } : g));
                        }}
                      >
                        <option value="IMAGE">IMAGE</option>
                        <option value="VIDEO">VIDEO</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Bento Size</label>
                      <select 
                        value={item.size} 
                        onChange={(e) => {
                          const size = e.target.value;
                          setGallery(prev => prev.map(g => g.id === item.id ? { ...g, size } : g));
                        }}
                      >
                        <option value="SQUARE">SQUARE</option>
                        <option value="WIDE">WIDE</option>
                        <option value="TALL">TALL</option>
                        <option value="LARGE_SQUARE">LARGE SQUARE</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Media Category</label>
                      <select 
                        value={item.category || 'CLASSES'} 
                        onChange={(e) => {
                          const category = e.target.value;
                          setGallery(prev => prev.map(g => g.id === item.id ? { ...g, category } : g));
                        }}
                      >
                        <option value="CLASSES">CLASSES</option>
                        <option value="FASHION">FASHION</option>
                        <option value="PHOTOGRAPHY">PHOTOGRAPHY</option>
                        <option value="ACTING">ACTING</option>
                        <option value="WORKSHOPS">WORKSHOPS</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Alt / Label Text</label>
                    <input 
                      value={item.altText} 
                      onChange={(e) => {
                        const altText = e.target.value;
                        setGallery(prev => prev.map(g => g.id === item.id ? { ...g, altText } : g));
                      }}
                      type="text" 
                      required 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Media URL</label>
                    <div className={styles.inputWithUpload}>
                      <input 
                        value={item.url} 
                        onChange={(e) => {
                          const url = e.target.value;
                          setGallery(prev => prev.map(g => g.id === item.id ? { ...g, url } : g));
                        }}
                        type="text" 
                        required 
                        disabled={uploadingKey !== null}
                      />
                      <div className={styles.uploadWrapper}>
                        <input 
                          type="file" 
                          accept={item.type === 'VIDEO' ? 'video/*' : 'image/*'} 
                          id={`bento-file-${item.id}`}
                          onChange={(e) => handleFileUpload(e, item.id, (url) => {
                            setGallery(prev => prev.map(g => g.id === item.id ? { ...g, url } : g));
                          })}
                          className={styles.fileInput}
                          disabled={uploadingKey !== null}
                        />
                        <label htmlFor={`bento-file-${item.id}`} className={styles.btnUpload}>
                          {uploadingKey === item.id ? `Uploading ${uploadPercent}%` : `Upload ${item.type.toLowerCase()}`}
                        </label>
                      </div>
                    </div>
                    {item.url && (
                      <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222', width: 'fit-content' }}>
                        {item.type === 'VIDEO' ? (
                          <video src={item.url} width="160" height="90" controls muted style={{ display: 'block' }} />
                        ) : (
                          <img src={item.url} alt="Bento Preview" style={{ width: '160px', height: '100px', objectFit: 'cover', display: 'block' }} />
                        )}
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleBentoSubmit(item)} className={styles.btnSave}>Save Bento Slot</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. MENTORS CMS */}
        {activeTab === 'mentors' && (
          <div className={styles.panel}>
            <div className={styles.gridCMS}>
              {/* Form to Add / Edit */}
              <div className={styles.formCard}>
                <h3>{editingMentorId ? 'Edit Teacher Profile' : 'Add New Teacher Profile'}</h3>
                <form onSubmit={handleMentorSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Full Name</label>
                    <input 
                      value={newMentor.name} 
                      onChange={(e) => setNewMentor((prev: any) => ({ ...prev, name: e.target.value }))} 
                      type="text" 
                      required 
                      placeholder="e.g. Julia Marse"
                    />
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>Role / Position Title</label>
                      <input 
                        value={newMentor.role} 
                        onChange={(e) => setNewMentor((prev: any) => ({ ...prev, role: e.target.value }))} 
                        type="text" 
                        required 
                        placeholder="e.g. Master Fashion Director"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Subject Taught</label>
                      <input 
                        value={newMentor.subjectTaught || ''} 
                        onChange={(e) => setNewMentor((prev: any) => ({ ...prev, subjectTaught: e.target.value }))} 
                        type="text" 
                        placeholder="e.g. Runway Walking & Camera Posing"
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Short Biography</label>
                    <textarea 
                      value={newMentor.bio} 
                      onChange={(e) => setNewMentor((prev: any) => ({ ...prev, bio: e.target.value }))} 
                      required
                      style={{ minHeight: '90px' }}
                      placeholder="Enter short bio profile..."
                    ></textarea>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Professional Experience & Selected Credits</label>
                    <textarea 
                      value={newMentor.experienceCredits || ''} 
                      onChange={(e) => setNewMentor((prev: any) => ({ ...prev, experienceCredits: e.target.value }))} 
                      style={{ minHeight: '80px' }}
                      placeholder="e.g. Vogue Italia, Paris Fashion Week, 12+ Years Industry Experience"
                    ></textarea>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Professional Portrait Image URL</label>
                    <div className={styles.inputWithUpload}>
                      <input 
                        value={newMentor.image} 
                        onChange={(e) => setNewMentor((prev: any) => ({ ...prev, image: e.target.value }))} 
                        type="text" 
                        placeholder="/team-1.jpg" 
                        disabled={uploadingKey !== null}
                      />
                      <div className={styles.uploadWrapper}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="mentor-image-upload"
                          onChange={(e) => handleFileUpload(e, 'mentor-image', (url) => setNewMentor((prev: any) => ({ ...prev, image: url })))}
                          className={styles.fileInput}
                          disabled={uploadingKey !== null}
                        />
                        <label htmlFor="mentor-image-upload" className={styles.btnUpload}>
                          {uploadingKey === 'mentor-image' ? `Uploading ${uploadPercent}%` : 'Upload Photo'}
                        </label>
                      </div>
                    </div>
                    {newMentor.image && (
                      <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222', width: 'fit-content' }}>
                        <img src={newMentor.image} alt="Mentor Profile Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', display: 'block' }} />
                      </div>
                    )}
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>Instagram URL</label>
                      <input 
                        value={newMentor.instagram || ''} 
                        onChange={(e) => setNewMentor((prev: any) => ({ ...prev, instagram: e.target.value }))} 
                        type="text" 
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>LinkedIn URL</label>
                      <input 
                        value={newMentor.linkedin || ''} 
                        onChange={(e) => setNewMentor((prev: any) => ({ ...prev, linkedin: e.target.value }))} 
                        type="text" 
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>Behance URL</label>
                      <input 
                        value={newMentor.behance || ''} 
                        onChange={(e) => setNewMentor((prev: any) => ({ ...prev, behance: e.target.value }))} 
                        type="text" 
                        placeholder="https://behance.net/..."
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Portfolio / Website URL</label>
                      <input 
                        value={newMentor.website || ''} 
                        onChange={(e) => setNewMentor((prev: any) => ({ ...prev, website: e.target.value }))} 
                        type="text" 
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Visibility Toggle */}
                  <div className={styles.inputGroup} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                      <input 
                        type="checkbox"
                        checked={!newMentor.hidden}
                        onChange={(e) => setNewMentor((prev: any) => ({ ...prev, hidden: !e.target.checked }))}
                        style={{ accentColor: '#D4AF37', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>Published & Visible on Website</span>
                    </label>
                  </div>
                  
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnSave}>Save Teacher Profile</button>
                    {editingMentorId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingMentorId(null);
                          setNewMentor({ name: '', role: '', subjectTaught: '', bio: '', experienceCredits: '', image: '', video: '', instagram: '#', linkedin: '#', behance: '#', website: '#', hidden: false });
                        }} 
                        className={styles.btnCancel}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Mentors List */}
              <div className={styles.listCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #111111', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Faculty Profiles ({mentors.length})</h3>
                    <span style={{ fontSize: '10px', color: '#888', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                      ↕ Drag to reorder
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleSaveAllMentors} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: '750', cursor: 'pointer' }}>
                      ✓ Save Order
                    </button>
                    <button 
                      onClick={() => {
                        setEditingMentorId(null);
                        setNewMentor({ name: '', role: '', subjectTaught: '', bio: '', experienceCredits: '', image: '', video: '', instagram: '#', linkedin: '#', behance: '#', website: '#', hidden: false });
                        showToast('Switched to Add New Teacher Profile mode', 'success');
                      }}
                      className={styles.listEditBtn}
                      style={{ fontSize: '11px', padding: '6px 12px' }}
                    >
                      + Add New
                    </button>
                  </div>
                </div>
                <div className={styles.listContainer}>
                  {mentors.map((mentor, index) => (
                    <div 
                      key={mentor.id} 
                      className={styles.listItem}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", index.toString());
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
                        const hoverIndex = index;
                        if (dragIndex === hoverIndex) return;
                        const updated = [...mentors];
                        const [draggedItem] = updated.splice(dragIndex, 1);
                        updated.splice(hoverIndex, 0, draggedItem);
                        setMentors(updated);
                        showToast('Swapped teachers order. Click Save Order to apply!', 'success');
                      }}
                      style={{ cursor: 'move', opacity: mentor.hidden ? 0.5 : 1 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '6px', color: '#555' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                      </div>
                      <img src={mentor.image || '/hero-model.png'} alt={mentor.name} className={styles.listAvatar} />
                      <div className={styles.listItemMeta}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0 }}>{mentor.name}</h4>
                          {mentor.hidden ? (
                            <span style={{ fontSize: '9px', background: '#dc2626', color: '#fff', padding: '1px 6px', borderRadius: '3px', fontWeight: '700' }}>HIDDEN</span>
                          ) : (
                            <span style={{ fontSize: '9px', background: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: '3px', fontWeight: '700' }}>LIVE</span>
                          )}
                        </div>
                        <p style={{ fontSize: '11px', color: '#888', margin: '2px 0' }}>{mentor.role}</p>
                        {mentor.subjectTaught && (
                          <p style={{ fontSize: '10px', color: '#D4AF37', margin: 0 }}>Subject: {mentor.subjectTaught}</p>
                        )}
                      </div>

                      <div className={styles.listItemActions}>
                        <button 
                          onClick={async () => {
                            const updatedHidden = !mentor.hidden;
                            setMentors(prev => prev.map(m => m.id === mentor.id ? { ...m, hidden: updatedHidden } : m));
                            try {
                              await fetch('/api/admin/mentors', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ...mentor, hidden: updatedHidden })
                              });
                              showToast(updatedHidden ? `Hidden "${mentor.name}" from website` : `Published "${mentor.name}" on website`, 'success');
                            } catch (e) {
                              showToast('Failed to toggle visibility', 'error');
                            }
                          }}
                          className={styles.listEditBtn}
                          style={{ background: mentor.hidden ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: mentor.hidden ? '#10b981' : '#ef4444', border: 'none', fontSize: '10px' }}
                        >
                          {mentor.hidden ? 'Show' : 'Hide'}
                        </button>
                        <button 
                          onClick={() => {
                            setEditingMentorId(mentor.id);
                            setNewMentor({
                              name: mentor.name,
                              role: mentor.role,
                              subjectTaught: mentor.subjectTaught || '',
                              bio: mentor.bio,
                              experienceCredits: mentor.experienceCredits || '',
                              image: mentor.image,
                              video: mentor.video || '',
                              hidden: mentor.hidden || false,
                              instagram: mentor.socials?.instagram || '#',
                              linkedin: mentor.socials?.linkedin || '#',
                              behance: mentor.socials?.behance || '#',
                              website: mentor.socials?.website || '#'
                            });
                          }} 
                          className={styles.listEditBtn}
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDeleteMentor(mentor.id)} className={styles.listDeleteBtn}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. PRICING PLANS CMS (Visual Card Editor) */}
        {activeTab === 'pricing' && (
          <div className={styles.panel}>
            <div className={styles.pricingHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Visual Pricing Pathways</h3>
                <span style={{ fontSize: '11px', color: '#888', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
                  ↕ Drag cards to reorder
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSaveAllPricing} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  ✓ Save All Settings
                </button>
                <button onClick={handleCreatePricingPlan} className={styles.btnCreatePlan}>
                  + Create New Plan
                </button>
              </div>
            </div>
            
            <div className={styles.pricingEditorGrid}>
              {pricing.map((plan, index) => {
                let cardStyleClass = styles.planCardPreview;
                let isDark = false;
                let badgeLabel = '';

                if (plan.badge === 'RECOMMENDED') {
                  cardStyleClass = styles.featuredPlanCardPreview;
                  isDark = true;
                  badgeLabel = 'RECOMMENDED';
                } else if (plan.badge === 'MOST_POPULAR') {
                  cardStyleClass = styles.navyPlanCardPreview;
                  isDark = true;
                  badgeLabel = 'MOST POPULAR';
                } else if (plan.badge === 'ELITE') {
                  cardStyleClass = styles.goldPlanCardPreview;
                  isDark = true;
                  badgeLabel = 'ELITE ACCESS';
                } else if (plan.isFeatured) {
                  cardStyleClass = styles.featuredPlanCardPreview;
                  isDark = true;
                  badgeLabel = 'RECOMMENDED';
                }
                
                return (
                  <div 
                    key={plan.id} 
                    className={cardStyleClass}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", index.toString());
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
                      const hoverIndex = index;
                      if (dragIndex === hoverIndex) return;
                      const updated = [...pricing];
                      const [draggedItem] = updated.splice(dragIndex, 1);
                      updated.splice(hoverIndex, 0, draggedItem);
                      setPricing(updated);
                      showToast('Swapped pricing plans. Click Save All to apply changes!', 'success');
                    }}
                    style={{ cursor: 'move' }}
                  >
                    {badgeLabel && (
                      <div 
                        className={styles.cardBadge}
                        style={
                          plan.badge === 'MOST_POPULAR' ? { backgroundColor: '#3b82f6', color: '#ffffff' } :
                          plan.badge === 'ELITE' ? { backgroundColor: '#D4AF37', color: '#000000' } : undefined
                        }
                      >
                        {badgeLabel}
                      </div>
                    )}
                    
                    <div className={styles.cardHeaderEdit}>
                      <input 
                        className={styles.inputPlanTitle}
                        value={plan.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setPricing(prev => prev.map(p => p.id === plan.id ? { ...p, name } : p));
                        }}
                        placeholder="Plan Title"
                      />
                      
                      <textarea 
                        className={styles.textareaPlanDesc}
                        value={plan.description}
                        onChange={(e) => {
                          const description = e.target.value;
                          setPricing(prev => prev.map(p => p.id === plan.id ? { ...p, description } : p));
                        }}
                        placeholder="Short description of the pathway benefits."
                      />
                      
                      <div className={styles.cardPriceRow}>
                        <input 
                          className={styles.inputPlanPrice}
                          value={plan.price}
                          onChange={(e) => {
                            const price = e.target.value;
                            setPricing(prev => prev.map(p => p.id === plan.id ? { ...p, price } : p));
                          }}
                          placeholder="$48,000"
                        />
                        <input 
                          className={styles.inputPlanPeriod}
                          value={plan.period}
                          onChange={(e) => {
                            const period = e.target.value;
                            setPricing(prev => prev.map(p => p.id === plan.id ? { ...p, period } : p));
                          }}
                          placeholder="/yr"
                        />
                      </div>
                    </div>
                    
                    <ul className={styles.cardFeaturesList}>
                      {plan.features.map((feature: string, idx: number) => (
                        <li key={idx} className={styles.cardFeatureItem}>
                          <span className={`material-symbols-outlined ${styles.cardFeatureIcon}`}>
                            {plan.badge === 'ELITE' ? 'workspace_premium' : 'check_circle'}
                          </span>
                          <input 
                            className={styles.inputFeatureText}
                            value={feature}
                            onChange={(e) => {
                              const updated = [...plan.features];
                              updated[idx] = e.target.value;
                              setPricing(prev => prev.map(p => p.id === plan.id ? { ...p, features: updated } : p));
                            }}
                            placeholder="Benefit details"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const updated = plan.features.filter((_: any, fIdx: number) => fIdx !== idx);
                              setPricing(prev => prev.map(p => p.id === plan.id ? { ...p, features: updated } : p));
                            }}
                            className={styles.btnRemoveFeature}
                            title="Remove benefit"
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                      <button 
                        type="button"
                        onClick={() => {
                          const updated = [...plan.features, 'New premium benefit details'];
                          setPricing(prev => prev.map(p => p.id === plan.id ? { ...p, features: updated } : p));
                        }}
                        className={styles.btnAddFeature}
                      >
                        + Add Feature Benefit
                      </button>
                    </ul>

                    <div className={styles.cardCheckboxRow}>
                      <label style={{ marginRight: '8px' }}>Card Theme / Badge:</label>
                      <select 
                        value={plan.badge || 'NONE'} 
                        onChange={(e) => {
                          const badgeVal = e.target.value;
                          const featuredVal = (badgeVal === 'RECOMMENDED' || badgeVal === 'MOST_POPULAR' || badgeVal === 'ELITE');
                          setPricing(prev => prev.map(p => p.id === plan.id ? { ...p, badge: badgeVal, isFeatured: featuredVal } : p));
                        }}
                        style={{
                          backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
                          color: isDark ? '#ffffff' : '#000000',
                          border: isDark ? '1px solid #333' : '1px solid #ccc',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px'
                        }}
                      >
                        <option value="NONE">Standard (White Card)</option>
                        <option value="RECOMMENDED">Recommended (Black Card)</option>
                        <option value="MOST_POPULAR">Most Popular (Dark Navy Card)</option>
                        <option value="ELITE">Elite / VIP (Luxury Gold Card)</option>
                      </select>
                    </div>

                    <div className={styles.cardActions}>
                      <button onClick={() => handlePricingSubmit(plan)} className={styles.btnCardSave}>
                        Save Plan
                      </button>
                      <button onClick={() => handleDeletePricingPlan(plan.id)} className={styles.btnCardDelete}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 8. FAQs CMS */}
        {activeTab === 'faqs' && (
          <div className={styles.panel}>
            <div className={styles.gridCMS}>
              {/* Form to Add / Edit */}
              <div className={styles.formCard}>
                <h3>{editingFaqId ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                <form onSubmit={handleFaqSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Question</label>
                    <input 
                      value={newFaq.question} 
                      onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))} 
                      type="text" 
                      required 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Answer Text</label>
                    <textarea 
                      value={newFaq.answer} 
                      onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))} 
                      required
                    ></textarea>
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnSave}>Save FAQ</button>
                    {editingFaqId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingFaqId(null);
                          setNewFaq({ question: '', answer: '' });
                        }} 
                        className={styles.btnCancel}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* FAQs List */}
              <div className={styles.listCard}>
                <h3>Accordion FAQs</h3>
                <div className={styles.listContainer}>
                  {faqs.map((faq) => (
                    <div key={faq.id} className={styles.listItem} style={{ alignItems: 'flex-start', padding: '16px' }}>
                      <div className={styles.listItemMeta}>
                        <h4 style={{ color: '#ffffff', marginBottom: '8px' }}>{faq.question}</h4>
                        <p style={{ fontSize: '13px', color: '#888888', lineBreak: 'anywhere' }}>{faq.answer}</p>
                      </div>
                      <div className={styles.listItemActions}>
                        <button 
                          onClick={() => {
                            setEditingFaqId(faq.id);
                            setNewFaq({ question: faq.question, answer: faq.answer });
                          }} 
                          className={styles.listEditBtn}
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDeleteFaq(faq.id)} className={styles.listDeleteBtn}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. TESTIMONIALS CMS */}
        {activeTab === 'testimonials' && (
          <div className={styles.panel}>
            <div className={styles.gridCMS}>
              {/* Form to Add / Edit */}
              <div className={styles.formCard}>
                <h3>{editingTestimonialId ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
                <form onSubmit={handleTestimonialSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Quote / Review Text</label>
                    <textarea
                      value={newTestimonial.quote}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, quote: e.target.value }))}
                      required
                      style={{ minHeight: '120px' }}
                      placeholder="Write the testimonial quote here..."
                    ></textarea>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Author Name</label>
                    <input
                      value={newTestimonial.author}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, author: e.target.value }))}
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Role / Title</label>
                    <input
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, role: e.target.value }))}
                      type="text"
                      placeholder="e.g. Fine Art Photographer & Alumna"
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnSave}>
                      {editingTestimonialId ? 'Update Testimonial' : 'Add Testimonial'}
                    </button>
                    {editingTestimonialId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTestimonialId(null);
                          setNewTestimonial({ quote: '', author: '', role: '' });
                        }}
                        className={styles.btnCancel}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Testimonials List */}
              <div className={styles.listCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #111111', paddingBottom: '12px' }}>
                  <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Published Testimonials ({testimonials.length})</h3>
                  <button
                    onClick={() => {
                      setEditingTestimonialId(null);
                      setNewTestimonial({ quote: '', author: '', role: '' });
                      showToast('Switched to Add New Testimonial mode', 'success');
                    }}
                    className={styles.listEditBtn}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    + Add New
                  </button>
                </div>
                <div className={styles.listContainer}>
                  {testimonials.length === 0 ? (
                    <p style={{ color: '#555', fontSize: '13px', padding: '16px 0' }}>No testimonials found. Add your first one!</p>
                  ) : (
                    testimonials.map((t) => (
                      <div key={t.id} className={styles.listItem} style={{ alignItems: 'flex-start', padding: '16px' }}>
                        <div className={styles.listItemMeta}>
                          <h4 style={{ color: '#ffffff', marginBottom: '4px' }}>{t.author}</h4>
                          <p style={{ fontSize: '11px', color: '#D4AF37', marginBottom: '8px' }}>{t.role}</p>
                          <p style={{ fontSize: '13px', color: '#888888', lineHeight: '1.5' }}>"{t.quote}"</p>
                        </div>
                        <div className={styles.listItemActions}>
                          <button
                            onClick={() => {
                              setEditingTestimonialId(t.id);
                              setNewTestimonial({ quote: t.quote, author: t.author, role: t.role });
                            }}
                            className={styles.listEditBtn}
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDeleteTestimonial(t.id)} className={styles.listDeleteBtn}>Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. ELCAPTAIN EMAIL SYSTEM */}
        {activeTab === 'elcaptain' && (
          <div className={styles.panel}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '24px' }}>
                <h2 style={{ fontSize: '28px', color: '#ffffff', fontFamily: "'Georgia', serif", letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px', border: 'none', padding: 0 }}>
                  🚀 Elcaptain Email System
                </h2>
                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                  Manage customer relations and broadcast custom-tailored marketing campaigns to chosen contacts.
                </p>
              </div>

              {isSendingCampaign && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '12px', padding: '16px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className={styles.spinner} style={{ borderColor: '#10b981', borderWidth: '2px', width: '18px', height: '18px' }} />
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{campaignSendProgress}</span>
                </div>
              )}

              <div className={styles.gridCMS}>
                
                {/* Recipients List Panel */}
                <div className={styles.listCard} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #111111', paddingBottom: '12px' }}>
                    <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Recipients List</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        id="selectAll"
                        checked={selectedEmails.length === getUniqueCustomers().length && getUniqueCustomers().length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEmails(getUniqueCustomers().map(c => c.email));
                          } else {
                            setSelectedEmails([]);
                          }
                        }}
                        style={{ cursor: 'pointer', accentColor: '#D4AF37' }}
                      />
                      <label htmlFor="selectAll" style={{ fontSize: '11px', color: '#888', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 'bold' }}>Select All</label>
                    </div>
                  </div>

                  <div className={styles.listContainer} style={{ flexGrow: 1, maxHeight: '600px', overflowY: 'auto' }}>
                    {getUniqueCustomers().length === 0 ? (
                      <p style={{ color: '#555', fontSize: '13px', textAlign: 'center', padding: '32px 0' }}>No unique customer contacts found in database.</p>
                    ) : (
                      getUniqueCustomers().map((customer) => {
                        const isChecked = selectedEmails.includes(customer.email);
                        return (
                          <div 
                            key={customer.email} 
                            onClick={() => {
                              if (isChecked) {
                                setSelectedEmails(prev => prev.filter(email => email !== customer.email));
                              } else {
                                setSelectedEmails(prev => [...prev, customer.email]);
                              }
                            }}
                            className={styles.listItem} 
                            style={{ 
                              padding: '12px 16px', 
                              cursor: 'pointer', 
                              backgroundColor: isChecked ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
                              border: isChecked ? '1px solid rgba(212, 175, 55, 0.15)' : '1px solid transparent',
                              borderRadius: '8px',
                              marginBottom: '8px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}} // Click handled by parent item
                                style={{ accentColor: '#D4AF37', cursor: 'pointer' }}
                              />
                              <div className={styles.listItemMeta}>
                                <h4 style={{ color: '#ffffff', fontSize: '14px', marginBottom: '2px' }}>{customer.name}</h4>
                                <p style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>{customer.email}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  <div style={{ borderTop: '1px solid #111111', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                    <span>Selected Contacts: <strong style={{ color: '#D4AF37' }}>{selectedEmails.length}</strong></span>
                    <span>Total Contacts: <strong>{getUniqueCustomers().length}</strong></span>
                  </div>
                </div>

                {/* Campaign Composer Form & Live Preview */}
                <div className={styles.formCard}>
                  <h3 style={{ borderBottom: '1px solid #111111', paddingBottom: '12px', marginBottom: '20px' }}>Compose Broadcast Campaign</h3>
                  
                  <form onSubmit={handleSendCampaign} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <label>Email Subject (Line appearing in inbox)</label>
                      <input 
                        type="text"
                        value={campaignSubject}
                        onChange={(e) => setCampaignSubject(e.target.value)}
                        placeholder="e.g. Exclusive Private Invitation to Marse Talent Academy"
                        required
                        disabled={isSendingCampaign}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Cover Header Image URL (Optional Banner)</label>
                      <input 
                        type="text"
                        value={campaignHeaderImage}
                        onChange={(e) => setCampaignHeaderImage(e.target.value)}
                        placeholder="e.g. https://domain.com/banner.jpg"
                        disabled={isSendingCampaign}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Email Header Title (Big title inside email)</label>
                      <input 
                        type="text"
                        value={campaignHeaderTitle}
                        onChange={(e) => setCampaignHeaderTitle(e.target.value)}
                        placeholder="e.g. Elevate Your Creative Agency Beyond Borders"
                        required
                        disabled={isSendingCampaign}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Message Content (Supports spacing)</label>
                      <textarea
                        value={campaignBodyText}
                        onChange={(e) => setCampaignBodyText(e.target.value)}
                        placeholder="Write your email marketing content here..."
                        required
                        style={{ minHeight: '160px' }}
                        disabled={isSendingCampaign}
                      ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className={styles.inputGroup}>
                        <label>CTA Button Text (Optional)</label>
                        <input 
                          type="text"
                          value={campaignCtaLabel}
                          onChange={(e) => setCampaignCtaLabel(e.target.value)}
                          placeholder="e.g. Reserve Seat Now"
                          disabled={isSendingCampaign}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>CTA Button URL (Optional)</label>
                        <input 
                          type="text"
                          value={campaignCtaUrl}
                          onChange={(e) => setCampaignCtaUrl(e.target.value)}
                          placeholder="e.g. https://domain.com/checkout"
                          disabled={isSendingCampaign}
                        />
                      </div>
                    </div>

                    <div className={styles.formActions} style={{ marginTop: '24px' }}>
                      <button 
                        type="submit" 
                        className={styles.btnSave} 
                        style={{ width: '100%', background: '#D4AF37', color: '#000000', borderColor: '#D4AF37', fontWeight: 'bold' }}
                        disabled={isSendingCampaign || selectedEmails.length === 0}
                      >
                        {isSendingCampaign ? 'Sending Broadcast...' : `🚀 Send Campaign to ${selectedEmails.length} Selected`}
                      </button>
                    </div>
                  </form>

                  {/* LIVE PREVIEW BLOCK */}
                  <div style={{ marginTop: '36px', borderTop: '1px solid #111111', paddingTop: '24px' }}>
                    <h4 style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Live Template Preview</h4>
                    <div style={{ background: '#f7f7f7', borderRadius: '8px', border: '1px solid #eaeaea', padding: '24px', color: '#1a1a1a', width: '100%', boxSizing: 'border-box' }}>
                      <div style={{ background: '#000000', borderBottom: '2px solid #D4AF37', padding: '16px', textAlign: 'center', borderRadius: '4px 4px 0 0' }}>
                        <div style={{ color: '#ffffff', fontFamily: 'Georgia, serif', fontSize: '18px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Marse Talent</div>
                        <div style={{ color: '#D4AF37', fontSize: '8px', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '4px' }}>Luxury Style Academy</div>
                      </div>
                      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '0 0 4px 4px' }}>
                        {campaignHeaderImage && (
                          <img src={campaignHeaderImage} alt="Cover Banner" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '4px', marginBottom: '16px' }} />
                        )}
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 'normal', color: '#000000', marginTop: 0, marginBottom: '16px' }}>
                          {campaignHeaderTitle || 'Email Header Title'}
                        </h1>
                        <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#2b2b2b', whiteSpace: 'pre-line', margin: 0 }}>
                          {campaignBodyText || 'Message content preview will appear here as you type...'}
                        </p>
                        {campaignCtaLabel && campaignCtaUrl && (
                          <div style={{ textAlign: 'center', margin: '24px 0 12px' }}>
                            <span style={{ display: 'inline-block', backgroundColor: '#000000', color: '#ffffff', textDecoration: 'none', padding: '10px 24px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid #D4AF37' }}>
                              {campaignCtaLabel}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* 11. CLASSES & COHORTS */}
        {activeTab === 'cohorts' && (
          <div className={styles.panel}>
            <div className={styles.formAndListLayout}>
              {/* Form Card */}
              <div className={styles.formCard}>
                <h3>Create New Class / Cohort</h3>
                <form onSubmit={handleAddCohort} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Cohort / Class Name</label>
                    <input 
                      type="text" 
                      value={newCohortName} 
                      onChange={(e) => setNewCohortName(e.target.value)} 
                      placeholder="e.g. Creative Arts Term 1 - Fall 2026" 
                      required 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className={styles.inputGroup}>
                      <label>Start Date</label>
                      <input 
                        type="date" 
                        value={newCohortStartDate} 
                        onChange={(e) => setNewCohortStartDate(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>End Date</label>
                      <input 
                        type="date" 
                        value={newCohortEndDate} 
                        onChange={(e) => setNewCohortEndDate(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Maximum Student Capacity</label>
                    <input 
                      type="number" 
                      value={newCohortCapacity} 
                      onChange={(e) => setNewCohortCapacity(e.target.value)} 
                      min="1" 
                      required 
                    />
                  </div>
                  <button type="submit" className={styles.btnSave}>Create Cohort</button>
                </form>
              </div>

              {/* List Card */}
              <div className={styles.listCard}>
                <h3>Active Cohorts ({cohorts.length})</h3>
                <div className={styles.listContainer}>
                  {cohorts.length === 0 ? (
                    <p style={{ color: '#666', fontSize: '13px', padding: '16px 0' }}>No active classes/cohorts found. Create your first one!</p>
                  ) : (
                    cohorts.map((c) => {
                      const enrolledCount = applications.filter(app => app.cohortId === c.id && app.status === 'APPROVED').length;
                      return (
                        <div key={c.id} className={styles.listItem}>
                          <div className={styles.listItemMeta}>
                            <h4 style={{ color: '#ffffff', marginBottom: '4px' }}>{c.name}</h4>
                            <p style={{ fontSize: '12px', color: '#D4AF37', margin: 0 }}>
                              📅 {new Date(c.startDate).toLocaleDateString()} to {new Date(c.endDate).toLocaleDateString()}
                            </p>
                            <div style={{ marginTop: '8px', fontSize: '11px', color: '#888' }}>
                              Capacity: <strong>{enrolledCount} / {c.capacity}</strong> students enrolled
                            </div>
                          </div>
                          <div className={styles.listItemActions}>
                            <button onClick={() => handleDeleteCohort(c.id)} className={styles.listDeleteBtn}>Delete</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 12. ATTENDANCE TRACKER */}
        {activeTab === 'attendance' && (
          <div className={styles.panel}>
            <div className={styles.dataSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Attendance Tracking Register</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>Select a class cohort and record student attendance</p>
                </div>
                
                {/* Filters */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <select 
                    value={selectedCohortId} 
                    onChange={(e) => setSelectedCohortId(e.target.value)}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#fff',
                      padding: '8px 12px',
                      fontSize: '13px',
                      outline: 'none',
                      cursor: 'pointer',
                      minWidth: '200px'
                    }}
                  >
                    <option value="" disabled>Select Class Cohort</option>
                    {cohorts.map(c => (
                      <option key={c.id} value={c.id} style={{ background: '#0a0a0a' }}>{c.name}</option>
                    ))}
                  </select>
                  <input 
                    type="date" 
                    value={attendanceDate} 
                    onChange={(e) => setAttendanceDate(e.target.value)} 
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#fff',
                      padding: '8px 12px',
                      fontSize: '13px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>

              {/* Attendance Table */}
              {!selectedCohortId ? (
                <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#333', marginBottom: '16px' }}>fact_check</span>
                  <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Please select a class cohort from the dropdown to start taking attendance.</p>
                </div>
              ) : (
                (() => {
                  const cohortStudents = applications.filter(app => app.cohortId === selectedCohortId && app.status === 'APPROVED');
                  if (cohortStudents.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#333', marginBottom: '16px' }}>group</span>
                        <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>No approved students are currently assigned to this cohort.</p>
                        <p style={{ color: '#555', margin: '4px 0 0 0', fontSize: '12px' }}>Go to the "Applications" tab to assign approved students to this class.</p>
                      </div>
                    );
                  }

                  return (
                    <div className={styles.tableWrapper}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Student Photo</th>
                            <th>Student Name</th>
                            <th>Student Email</th>
                            <th style={{ textAlign: 'center' }}>Attendance Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cohortStudents.map(student => (
                            <tr key={student.id}>
                              <td>
                                {student.photo ? (
                                  <img src={student.photo} alt="Student" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                                ) : (
                                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#444' }}>person</span>
                                )}
                              </td>
                              <td style={{ fontWeight: 'bold' }}>{student.fullName}</td>
                              <td>{student.email}</td>
                              <td>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                  {(['PRESENT', 'ABSENT', 'EXCUSED'] as const).map(status => {
                                    const isSelected = attendanceRecords[student.id] === status;
                                    let activeBg = 'rgba(16, 185, 129, 0.1)';
                                    let activeColor = '#10b981';
                                    let label = 'Present';

                                    if (status === 'ABSENT') {
                                      activeBg = 'rgba(239, 68, 68, 0.1)';
                                      activeColor = '#ef4444';
                                      label = 'Absent';
                                    } else if (status === 'EXCUSED') {
                                      activeBg = 'rgba(245, 158, 11, 0.1)';
                                      activeColor = '#f59e0b';
                                      label = 'Excused';
                                    }

                                    return (
                                      <button
                                        key={status}
                                        type="button"
                                        onClick={() => setAttendanceRecords(prev => ({ ...prev, [student.id]: status }))}
                                        style={{
                                          background: isSelected ? activeBg : 'transparent',
                                          color: isSelected ? activeColor : '#666',
                                          border: '1px solid',
                                          borderColor: isSelected ? activeColor : 'rgba(255,255,255,0.05)',
                                          padding: '4px 12px',
                                          borderRadius: '20px',
                                          fontSize: '11px',
                                          fontWeight: 'bold',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s ease'
                                        }}
                                      >
                                        {label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <button onClick={handleSaveAttendance} className={styles.btnSave} style={{ minWidth: '200px' }}>
                          💾 Save Attendance Register
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        )}

        {/* 13. STAFF & ROLES */}
        {activeTab === 'staff' && (
          <div className={styles.panel}>
            <div className={styles.formAndListLayout}>
              {/* Form Card */}
              <div className={styles.formCard}>
                <h3>Register Staff / User Account</h3>
                <form onSubmit={handleAddStaff} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={newStaffName} 
                      onChange={(e) => setNewStaffName(e.target.value)} 
                      placeholder="e.g. Coach Alexander" 
                      required 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={newStaffEmail} 
                      onChange={(e) => setNewStaffEmail(e.target.value)} 
                      placeholder="e.g. coach@marse-academy.com" 
                      required 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Staff Role / Permissions</label>
                    <select 
                      value={newStaffRole} 
                      onChange={(e) => setNewStaffRole(e.target.value)}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        padding: '12px 16px',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="INSTRUCTOR" style={{ background: '#0a0a0a' }}>INSTRUCTOR (Manage Cohorts & Attendance)</option>
                      <option value="ACCOUNTANT" style={{ background: '#0a0a0a' }}>ACCOUNTANT (Finance & Billing Ledger only)</option>
                      <option value="ADMIN" style={{ background: '#0a0a0a' }}>ADMIN (Full access control)</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Password</label>
                    <input 
                      type="password" 
                      value={newStaffPassword} 
                      onChange={(e) => setNewStaffPassword(e.target.value)} 
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                  <button type="submit" className={styles.btnSave}>Register Staff</button>
                </form>
              </div>

              {/* List Card */}
              <div className={styles.listCard}>
                <h3>Registered Staff Accounts ({staffList.length})</h3>
                <div className={styles.listContainer}>
                  {staffList.length === 0 ? (
                    <p style={{ color: '#666', fontSize: '13px', padding: '16px 0' }}>No sub-user staff accounts found. Create your first one!</p>
                  ) : (
                    staffList.map((s) => {
                      let roleColor = '#a855f7'; // Instructor purple
                      let roleBg = 'rgba(168, 85, 247, 0.08)';
                      
                      if (s.role === 'ADMIN') {
                        roleColor = '#D4AF37'; // Gold
                        roleBg = 'rgba(212, 175, 55, 0.08)';
                      } else if (s.role === 'ACCOUNTANT') {
                        roleColor = '#10b981'; // Green
                        roleBg = 'rgba(16, 185, 129, 0.08)';
                      }

                      return (
                        <div key={s.id} className={styles.listItem}>
                          <div className={styles.listItemMeta}>
                            <h4 style={{ color: '#ffffff', marginBottom: '4px' }}>{s.name}</h4>
                            <p style={{ fontSize: '12px', color: '#888888', marginBottom: '8px' }}>{s.email}</p>
                            <span style={{
                              backgroundColor: roleBg,
                              color: roleColor,
                              border: `1px solid ${roleColor}25`,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              {s.role}
                            </span>
                          </div>
                          <div className={styles.listItemActions}>
                            <button onClick={() => handleDeleteStaff(s.id)} className={styles.listDeleteBtn}>Delete</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 14. WHATSAPP ALERT ENGINE */}
        {activeTab === 'whatsapp' && (
          <div className={styles.panel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>WhatsApp Alert Engine</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#888888' }}>Configure Twilio gateway and monitor automated student absence & admission triggers</p>
              </div>
            </div>

            <div className={styles.formAndListLayout}>
              {/* Settings Card */}
              <div className={styles.formCard}>
                <h3>Twilio API Settings</h3>
                <form onSubmit={handleSaveWhatsappSettings} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Twilio Account SID</label>
                    <input 
                      type="text" 
                      value={whatsappSettings.twilioSid} 
                      onChange={(e) => setWhatsappSettings(prev => ({ ...prev, twilioSid: e.target.value }))} 
                      placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Twilio Auth Token</label>
                    <input 
                      type="password" 
                      value={whatsappSettings.twilioToken} 
                      onChange={(e) => setWhatsappSettings(prev => ({ ...prev, twilioToken: e.target.value }))} 
                      placeholder="••••••••••••••••••••••••••••••••" 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Twilio Sender Number</label>
                    <input 
                      type="text" 
                      value={whatsappSettings.twilioNumber} 
                      onChange={(e) => setWhatsappSettings(prev => ({ ...prev, twilioNumber: e.target.value }))} 
                      placeholder="+14155238886" 
                    />
                  </div>

                  <div style={{ margin: '20px 0 24px 0', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Automated Triggers</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                        <input 
                          type="checkbox" 
                          checked={whatsappSettings.autoOnAbsence} 
                          onChange={(e) => setWhatsappSettings(prev => ({ ...prev, autoOnAbsence: e.target.checked }))} 
                        />
                        Send automatic WhatsApp alert to Guardian on student Absence
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                        <input 
                          type="checkbox" 
                          checked={whatsappSettings.autoOnApproval} 
                          onChange={(e) => setWhatsappSettings(prev => ({ ...prev, autoOnApproval: e.target.checked }))} 
                        />
                        Send automatic WhatsApp alert to Student/Guardian on Admission Approval
                      </label>
                    </div>
                  </div>

                  <button type="submit" className={styles.btnSave}>Save Configuration</button>
                </form>

                <div style={{ marginTop: '36px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                  <h3>Test Dispatcher</h3>
                  <form onSubmit={handleSendWhatsappTest} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <label>Recipient Phone Number (with country code)</label>
                      <input 
                        type="text" 
                        value={whatsappTestTo} 
                        onChange={(e) => setWhatsappTestTo(e.target.value)} 
                        placeholder="e.g. +447700900077" 
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Message Content</label>
                      <textarea 
                        value={whatsappTestMsg} 
                        onChange={(e) => setWhatsappTestMsg(e.target.value)} 
                        placeholder="Type test message here..." 
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                          padding: '12px 16px',
                          minHeight: '80px',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    <button type="submit" className={styles.btnSave} disabled={isSendingWhatsappTest}>
                      {isSendingWhatsappTest ? 'Sending Test...' : 'Send Test WhatsApp'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Logs Card */}
              <div className={styles.listCard}>
                <h3>Dispatch Alert Log ({whatsappLogs.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto', paddingRight: '4px' }}>
                  {whatsappLogs.length === 0 ? (
                    <p style={{ color: '#666', fontSize: '13px', padding: '16px 0' }}>No WhatsApp logs registered yet.</p>
                  ) : (
                    whatsappLogs.map((log) => {
                      let statusColor = '#10b981';
                      let statusBg = 'rgba(16,185,129,0.08)';
                      if (log.status === 'FAILED') {
                        statusColor = '#ef4444';
                        statusBg = 'rgba(239,68,68,0.08)';
                      } else if (log.status === 'SIMULATED') {
                        statusColor = '#f59e0b';
                        statusBg = 'rgba(245,158,11,0.08)';
                      }

                      return (
                        <div key={log.id} style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffffff' }}>To: {log.recipient}</span>
                            <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: statusBg, color: statusColor }}>
                              {log.status}
                            </span>
                          </div>
                          <p style={{ fontSize: '12.5px', color: '#ccc', margin: '0 0 10px 0', lineHeight: '1.4' }}>{log.message}</p>
                          {log.error && <p style={{ fontSize: '11px', color: '#ef4444', margin: '0 0 8px 0', fontFamily: 'monospace' }}>Error: {log.error}</p>}
                          <span style={{ fontSize: '10px', color: '#666' }}>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 15. CORE SUBJECTS CMS */}
        {activeTab === 'subjects' && (
          <div className={styles.panel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Core Subjects CMS</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#888888' }}>
                  Create, edit, reorder (move up/down), or remove subjects displayed on the homepage ({coreSubjects.length} Active Subjects)
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => { setIsAddingSubject(true); setSelectedSubject(null); }}
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>➕ Add New Subject</span>
              </button>
            </div>

            <div className={styles.formAndListLayout}>
              {/* Editor / Creation Form Card */}
              <div className={styles.formCard}>
                {isAddingSubject ? (
                  <>
                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
                      ➕ Create New Subject
                    </h3>
                    <form onSubmit={handleCreateSubject} className={styles.form}>
                      <div className={styles.inputGroup}>
                        <label>Subject Title</label>
                        <input 
                          type="text" 
                          value={newSubject.title} 
                          onChange={(e) => setNewSubject({ ...newSubject, title: e.target.value })} 
                          placeholder="e.g. Masterclass Styling"
                          required 
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Icon Identifier (Material Symbol name, e.g. checkroom, movie, palette, star)</label>
                        <input 
                          type="text" 
                          value={newSubject.icon} 
                          onChange={(e) => setNewSubject({ ...newSubject, icon: e.target.value })} 
                          placeholder="e.g. checkroom"
                          required 
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Description</label>
                        <textarea 
                          value={newSubject.desc} 
                          onChange={(e) => setNewSubject({ ...newSubject, desc: e.target.value })} 
                          placeholder="Brief summary of what students master in this core subject..."
                          required 
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                            padding: '12px 16px',
                            minHeight: '110px',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className={styles.btnSave}>Create Subject</button>
                        <button type="button" onClick={() => setIsAddingSubject(false)} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>Cancel</button>
                      </div>
                    </form>
                  </>
                ) : selectedSubject ? (
                  <>
                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
                      ✏️ Edit Subject: {selectedSubject.title}
                    </h3>
                    <form onSubmit={handleSaveSubject} className={styles.form}>
                      <div className={styles.inputGroup}>
                        <label>Subject Title</label>
                        <input 
                          type="text" 
                          value={selectedSubject.title} 
                          onChange={(e) => setSelectedSubject({ ...selectedSubject, title: e.target.value })} 
                          required 
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Icon Identifier (Material Symbol name, e.g. checkroom, movie, palette, star)</label>
                        <input 
                          type="text" 
                          value={selectedSubject.icon} 
                          onChange={(e) => setSelectedSubject({ ...selectedSubject, icon: e.target.value })} 
                          required 
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Description</label>
                        <textarea 
                          value={selectedSubject.desc} 
                          onChange={(e) => setSelectedSubject({ ...selectedSubject, desc: e.target.value })} 
                          required 
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                            padding: '12px 16px',
                            minHeight: '110px',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className={styles.btnSave}>Save Changes</button>
                        <button type="button" onClick={() => setSelectedSubject(null)} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>Cancel</button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div style={{ padding: '24px 0', textAlign: 'center' }}>
                    <p style={{ color: '#888888', fontSize: '13px', margin: '0 0 16px 0' }}>Select a subject on the right to edit, or click below to add a new one.</p>
                    <button 
                      type="button" 
                      onClick={() => setIsAddingSubject(true)}
                      style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                    >
                      ➕ Add New Subject
                    </button>
                  </div>
                )}
              </div>

              {/* List Card */}
              <div className={styles.listCard}>
                <h3>Subjects List ({coreSubjects.length})</h3>
                <div className={styles.listContainer}>
                  {coreSubjects.map((s, idx) => (
                    <div 
                      key={s.id} 
                      className={`${styles.listItem} ${selectedSubject?.id === s.id ? styles.listActiveItem : ''}`}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}
                    >
                      <div 
                        onClick={() => { setSelectedSubject(s); setIsAddingSubject(false); }}
                        style={{ cursor: 'pointer', flex: 1 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#D4AF37' }}>{s.icon}</span>
                          <h4 style={{ color: '#ffffff', margin: 0, fontSize: '14px' }}>{s.title}</h4>
                        </div>
                        <p style={{ fontSize: '12px', color: '#888888', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.desc}</p>
                      </div>

                      {/* Controls: Move Up, Move Down, Delete */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button 
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSubject(idx, 'UP')}
                          title="Move Up"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: idx === 0 ? '#444' : '#fff',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            cursor: idx === 0 ? 'default' : 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ⬆
                        </button>
                        <button 
                          type="button"
                          disabled={idx === coreSubjects.length - 1}
                          onClick={() => handleMoveSubject(idx, 'DOWN')}
                          title="Move Down"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: idx === coreSubjects.length - 1 ? '#444' : '#fff',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            cursor: idx === coreSubjects.length - 1 ? 'default' : 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ⬇
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteSubject(s.id, s.title)}
                          title="Delete Subject"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 16. STUDENT JOURNEY CMS */}
        {activeTab === 'journey' && (
          <div className={styles.panel}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Student Journey CMS</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#888888' }}>Customize the 7 steps of the Student Journey trajectory timeline</p>
            </div>

            <div className={styles.formAndListLayout}>
              {/* Editor Form Card */}
              <div className={styles.formCard}>
                <h3>{selectedJourneyStep ? `Edit Step: ${selectedJourneyStep.title}` : 'Select a step from the list to edit'}</h3>
                {selectedJourneyStep ? (
                  <form onSubmit={handleSaveJourneyStep} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <label>Step Number Badge (e.g. 01, 02)</label>
                      <input 
                        type="text" 
                        value={selectedJourneyStep.step} 
                        onChange={(e) => setSelectedJourneyStep({ ...selectedJourneyStep, step: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Step Title</label>
                      <input 
                        type="text" 
                        value={selectedJourneyStep.title} 
                        onChange={(e) => setSelectedJourneyStep({ ...selectedJourneyStep, title: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Description</label>
                      <textarea 
                        value={selectedJourneyStep.desc} 
                        onChange={(e) => setSelectedJourneyStep({ ...selectedJourneyStep, desc: e.target.value })} 
                        required 
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                          padding: '12px 16px',
                          minHeight: '120px',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="submit" className={styles.btnSave}>Save Changes</button>
                      <button type="button" onClick={() => setSelectedJourneyStep(null)} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <p style={{ color: '#666', fontSize: '13px' }}>Click any step on the right to load its content into this editor.</p>
                )}
              </div>

              {/* List Card */}
              <div className={styles.listCard}>
                <h3>Journey Steps List ({journeySteps.length})</h3>
                <div className={styles.listContainer}>
                  {journeySteps.map((step) => (
                    <div 
                      key={step.id} 
                      className={`${styles.listItem} ${selectedJourneyStep?.id === step.id ? styles.listActiveItem : ''}`}
                      onClick={() => setSelectedJourneyStep(step)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.listItemMeta}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Step {step.step}</span>
                          <h4 style={{ color: '#ffffff', margin: 0 }}>{step.title}</h4>
                        </div>
                        <p style={{ fontSize: '12px', color: '#888888' }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 17. GLOBAL SETTINGS CMS */}
        {activeTab === 'settings' && (
          <div className={styles.panel}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Global Settings CMS</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#888888' }}>Configure general contact support values used across the academy front-end layout</p>
            </div>

            <div className={styles.formAndListLayout} style={{ gridTemplateColumns: '1fr' }}>
              <div className={styles.formCard} style={{ maxWidth: '660px' }}>
                <form onSubmit={handleSaveGlobalSettings} className={styles.form}>
                  <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>Academy Identity Logo</h3>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '28px' }}>
                    <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {globalSettings.logoUrl ? (
                        <img src={globalSettings.logoUrl} alt="Academy Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: '11px', color: '#888888' }}>No Logo</span>
                      )}
                    </div>
                    <div>
                      <div className={styles.uploadRow} style={{ margin: 0 }}>
                        <input 
                          type="file" 
                          id="global-logo-upload"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'global-logo', (url) => setGlobalSettings((prev: any) => ({ ...prev, logoUrl: url })))}
                          className={styles.fileInput}
                          disabled={uploadingKey !== null}
                        />
                        <label htmlFor="global-logo-upload" className={styles.btnUpload}>
                          {uploadingKey === 'global-logo' ? `Uploading ${uploadPercent}%` : 'Upload Brand Logo'}
                        </label>
                      </div>
                      <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#888888' }}>Recommended format: PNG, horizontal orientation, light background text.</p>
                    </div>
                  </div>

                  <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>Contact & Support Credentials</h3>
                  <div className={styles.inputGroup}>
                    <label>Support WhatsApp Phone Number (digits only, e.g. 1234567890)</label>
                    <input 
                      type="text" 
                      value={globalSettings.supportWhatsapp || ''} 
                      onChange={(e) => setGlobalSettings({ ...globalSettings, supportWhatsapp: e.target.value })} 
                      required 
                      placeholder="e.g. 1234567890"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Support Admission Email Address</label>
                    <input 
                      type="email" 
                      value={globalSettings.supportEmail || ''} 
                      onChange={(e) => setGlobalSettings({ ...globalSettings, supportEmail: e.target.value })} 
                      required 
                      placeholder="e.g. admissions@marse-academy.com"
                    />
                  </div>

                  <h3 style={{ margin: '24px 0 16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>Footer Visibility & Stats Config</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#ffffff' }}>
                      <input 
                        type="checkbox" 
                        checked={!!globalSettings.showStats} 
                        onChange={(e) => setGlobalSettings({ ...globalSettings, showStats: e.target.checked })} 
                      />
                      Show Statistics Panel in Footer
                    </label>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#ffffff' }}>
                      <input 
                        type="checkbox" 
                        checked={!!globalSettings.showFooterGallery} 
                        onChange={(e) => setGlobalSettings({ ...globalSettings, showFooterGallery: e.target.checked })} 
                      />
                      Show Gallery Banner Strip in Footer
                    </label>
                  </div>

                  {globalSettings.showStats && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metrics Values & Labels</h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '11px', color: '#888888' }}>Stat 1 Value (e.g. 20+)</label>
                          <input 
                            type="text" 
                            value={globalSettings.stat1Value || ''} 
                            onChange={(e) => setGlobalSettings({ ...globalSettings, stat1Value: e.target.value })} 
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', color: '#888888' }}>Stat 1 Label (e.g. COUNTRIES)</label>
                          <input 
                            type="text" 
                            value={globalSettings.stat1Label || ''} 
                            onChange={(e) => setGlobalSettings({ ...globalSettings, stat1Label: e.target.value })} 
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '11px', color: '#888888' }}>Stat 2 Value (e.g. 50+)</label>
                          <input 
                            type="text" 
                            value={globalSettings.stat2Value || ''} 
                            onChange={(e) => setGlobalSettings({ ...globalSettings, stat2Value: e.target.value })} 
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', color: '#888888' }}>Stat 2 Label (e.g. INDUSTRY PROFESSIONALS)</label>
                          <input 
                            type="text" 
                            value={globalSettings.stat2Label || ''} 
                            onChange={(e) => setGlobalSettings({ ...globalSettings, stat2Label: e.target.value })} 
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '11px', color: '#888888' }}>Stat 3 Value (e.g. 1000+)</label>
                          <input 
                            type="text" 
                            value={globalSettings.stat3Value || ''} 
                            onChange={(e) => setGlobalSettings({ ...globalSettings, stat3Value: e.target.value })} 
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', color: '#888888' }}>Stat 3 Label (e.g. STUDENTS EMPOWERED)</label>
                          <input 
                            type="text" 
                            value={globalSettings.stat3Label || ''} 
                            onChange={(e) => setGlobalSettings({ ...globalSettings, stat3Label: e.target.value })} 
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '11px', color: '#888888' }}>Stat 4 Value (e.g. 95%)</label>
                          <input 
                            type="text" 
                            value={globalSettings.stat4Value || ''} 
                            onChange={(e) => setGlobalSettings({ ...globalSettings, stat4Value: e.target.value })} 
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', color: '#888888' }}>Stat 4 Label (e.g. SUCCESS RATE)</label>
                          <input 
                            type="text" 
                            value={globalSettings.stat4Label || ''} 
                            onChange={(e) => setGlobalSettings({ ...globalSettings, stat4Label: e.target.value })} 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button type="submit" className={styles.btnSave}>Save Settings</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 19. PROGRAMS SHOWCASE CMS */}
        {activeTab === 'programs' && (
          <div className={styles.panel}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Programs Showcase CMS</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#888888' }}>Customize the 5 column program cards shown on the homepage and their images</p>
            </div>

            <div className={styles.formAndListLayout}>
              {/* Left side: Add / Edit Program Form */}
              <div className={styles.formCard}>
                <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  {editingProgramId ? 'Edit Program Card' : 'Create New Program Card'}
                </h3>
                
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const targetData = editingProgramId ? editingProgram : newProgram;
                  if (!targetData.title || !targetData.desc || !targetData.img) {
                    showToast('Please fill all fields and upload an image', 'error');
                    return;
                  }
                  
                  try {
                    const method = editingProgramId ? 'PUT' : 'POST';
                    const payload = editingProgramId ? { id: editingProgramId, ...editingProgram } : newProgram;
                    const response = await fetch('/api/admin/programs', {
                      method,
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload)
                    });
                    const resData = await response.json();
                    if (resData.success) {
                      showToast(editingProgramId ? 'Program updated successfully!' : 'Program created successfully!', 'success');
                      setEditingProgramId(null);
                      setNewProgram({ title: '', desc: '', img: '' });
                      loadAllData();
                    } else {
                      showToast(resData.error || 'Operation failed', 'error');
                    }
                  } catch (err) {
                    showToast('Error saving program card', 'error');
                  }
                }} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Program Title</label>
                    <input 
                      type="text"
                      value={editingProgramId ? editingProgram.title : newProgram.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (editingProgramId) setEditingProgram((prev: any) => ({ ...prev, title: val }));
                        else setNewProgram((prev: any) => ({ ...prev, title: val }));
                      }}
                      placeholder="e.g. FASHION & MODELING"
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Program Description</label>
                    <textarea 
                      value={editingProgramId ? editingProgram.desc : newProgram.desc}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (editingProgramId) setEditingProgram((prev: any) => ({ ...prev, desc: val }));
                        else setNewProgram((prev: any) => ({ ...prev, desc: val }));
                      }}
                      placeholder="e.g. Learn the art of modeling. Build confidence and presence."
                      required
                      style={{ minHeight: '80px' }}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Program Card Thumbnail Image</label>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '8px' }}>
                      <div style={{ width: '80px', height: '100px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {(editingProgramId ? editingProgram.img : newProgram.img) ? (
                          <img src={editingProgramId ? editingProgram.img : newProgram.img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '11px', color: '#888888' }}>No Image</span>
                        )}
                      </div>
                      <div>
                        <div className={styles.uploadRow} style={{ margin: 0 }}>
                          <input 
                            type="file" 
                            id="program-image-upload"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'program-img', (url) => {
                              if (editingProgramId) setEditingProgram((prev: any) => ({ ...prev, img: url }));
                              else setNewProgram((prev: any) => ({ ...prev, img: url }));
                            })}
                            className={styles.fileInput}
                            disabled={uploadingKey !== null}
                          />
                          <label htmlFor="program-image-upload" className={styles.btnUpload}>
                            {uploadingKey === 'program-img' ? `Uploading ${uploadPercent}%` : 'Upload Image'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button type="submit" className={styles.btnSave}>
                      {editingProgramId ? 'Save Changes' : 'Create Program'}
                    </button>
                    {editingProgramId && (
                      <button type="button" onClick={() => setEditingProgramId(null)} className={styles.btnCancel}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right side: List of Current Programs */}
              <div className={styles.listCard}>
                <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  Current Program Cards
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {programs.map((prog: any) => (
                    <div key={prog.id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '60px', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#333' }}>
                          <img src={prog.img} alt={prog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>{prog.title}</h4>
                          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888888', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prog.desc}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => {
                            setEditingProgramId(prog.id);
                            setEditingProgram({ title: prog.title, desc: prog.desc, img: prog.img });
                          }} 
                          className={styles.btnEdit}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this program?')) {
                              try {
                                const response = await fetch(`/api/admin/programs?id=${prog.id}`, { method: 'DELETE' });
                                const resData = await response.json();
                                if (resData.success) {
                                  showToast('Program deleted successfully!', 'success');
                                  loadAllData();
                                } else {
                                  showToast(resData.error || 'Failed to delete', 'error');
                                }
                              } catch (err) {
                                showToast('Error deleting program', 'error');
                              }
                            }
                          }} 
                          className={styles.btnDelete}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  {programs.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '24px', color: '#888888' }}>No programs found. Fallback details will be displayed on client views.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 20. CONTACT PAGE CMS */}
        {activeTab === 'contact' && (
          <div className={styles.panel}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Contact Page CMS</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#888888' }}>Customize the header copy, physical address, timing, and Google Maps iframe embed on the contact page.</p>
            </div>

            <div className={styles.formAndListLayout} style={{ gridTemplateColumns: '1fr' }}>
              <div className={styles.formCard} style={{ maxWidth: '660px' }}>
                <form onSubmit={handleSaveGlobalSettings} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Contact Hero Title</label>
                    <input 
                      type="text" 
                      value={globalSettings.contactTitle || ''} 
                      onChange={(e) => setGlobalSettings({ ...globalSettings, contactTitle: e.target.value })} 
                      required 
                      placeholder="e.g. CONTACT MARSE ACADEMY"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Contact Hero Description (Lead Text)</label>
                    <textarea 
                      value={globalSettings.contactLead || ''} 
                      onChange={(e) => setGlobalSettings({ ...globalSettings, contactLead: e.target.value })} 
                      required 
                      placeholder="Enter contact description text..."
                      style={{ minHeight: '80px', width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', padding: '10px' }}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Campus Physical Address</label>
                    <input 
                      type="text" 
                      value={globalSettings.contactAddress || ''} 
                      onChange={(e) => setGlobalSettings({ ...globalSettings, contactAddress: e.target.value })} 
                      required 
                      placeholder="e.g. MARSE Academy London Studio, Westminster, SW1P, United Kingdom"
                    />
                  </div>
                  <div className={styles.inputGroup} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label>Opening Hours (Weekdays)</label>
                      <input 
                        type="text" 
                        value={globalSettings.contactHours1 || ''} 
                        onChange={(e) => setGlobalSettings({ ...globalSettings, contactHours1: e.target.value })} 
                        required 
                        placeholder="e.g. Monday - Friday: 09:00 - 18:00"
                      />
                    </div>
                    <div>
                      <label>Opening Hours (Weekends)</label>
                      <input 
                        type="text" 
                        value={globalSettings.contactHours2 || ''} 
                        onChange={(e) => setGlobalSettings({ ...globalSettings, contactHours2: e.target.value })} 
                        required 
                        placeholder="e.g. Saturday - Sunday: 08:30 - 17:30"
                      />
                    </div>
                  </div>
                  <div className={styles.inputGroup} style={{ marginBottom: '24px' }}>
                    <label>Google Maps Iframe Embed URL (Src only)</label>
                    <input 
                      type="text" 
                      value={globalSettings.contactMapUrl || ''} 
                      onChange={(e) => setGlobalSettings({ ...globalSettings, contactMapUrl: e.target.value })} 
                      required 
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                  </div>

                  <button type="submit" className={styles.btnSave}>Save Contact Settings</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 18. ABOUT PAGE CMS */}
        {activeTab === 'about' && (
          <div className={styles.panel}>
            <div style={{ marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#D4AF37', letterSpacing: '0.02em' }}>About Us Page CMS</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#888888' }}>Configure all content paragraphs, quotes, and individual section imagery on the About Us page</p>
              </div>
              <button type="button" onClick={handleSaveAboutSettings} className={styles.btnSave} style={{ minWidth: '180px', padding: '10px 20px', fontSize: '13px' }}>
                Save About Us Content
              </button>
            </div>

            <form onSubmit={handleSaveAboutSettings} className={styles.form}>
              <div className={styles.formAndListLayout} style={{ gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                {/* Left Column: Hero & Story */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  
                  {/* 1. Hero Introduction Card */}
                  <div className={styles.formCard} style={{ border: '1px solid rgba(212, 175, 55, 0.15)', borderRadius: '12px', background: 'rgba(255,255,255,0.015)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', color: '#ffffff', fontWeight: '700' }}>1. Hero Header & Dual Media</h3>
                      <span style={{ fontSize: '10px', background: 'rgba(212,175,55,0.1)', color: '#D4AF37', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Top Page Header</span>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Hero Main Title</label>
                      <input 
                        type="text" 
                        value={aboutSettings.heroTitle || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, heroTitle: e.target.value })} 
                        required 
                        placeholder="e.g. A NEW GENERATION OF CREATIVES"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Hero Subtitle Lead Text</label>
                      <textarea 
                        value={aboutSettings.heroLead || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, heroLead: e.target.value })} 
                        required 
                        style={{ minHeight: '90px' }}
                        placeholder="Enter hero lead description..."
                      />
                    </div>

                    {/* Hero Image 1: Back Frame */}
                    <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
                      <label style={{ display: 'flex', justifyContent: 'space-between', color: '#D4AF37', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                        <span>Hero Background Image (Back Frame)</span>
                        <span style={{ fontSize: '10px', color: '#888' }}>Recommended 4:5 Portrait</span>
                      </label>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ width: '64px', height: '80px', borderRadius: '6px', overflow: 'hidden', background: '#000', flexShrink: 0, border: '1px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {aboutSettings.heroImageBack || aboutSettings.missionImage ? (
                            <img src={aboutSettings.heroImageBack || aboutSettings.missionImage} alt="Hero Back" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '10px', color: '#555' }}>No Image</span>
                          )}
                        </div>
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input 
                            type="text" 
                            value={aboutSettings.heroImageBack || ''} 
                            onChange={(e) => setAboutSettings({ ...aboutSettings, heroImageBack: e.target.value })} 
                            placeholder="/about-models.png"
                          />
                          <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
                            <button type="button" className={styles.btnUpload} style={{ padding: '6px 14px', fontSize: '11px' }}>
                              {uploadingKey === 'about-heroImageBack' ? `Uploading ${uploadPercent}%` : 'Upload Back Image'}
                            </button>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'about-heroImageBack', (url) => setAboutSettings((prev: any) => ({ ...prev, heroImageBack: url })))}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hero Image 2: Front Frame */}
                    <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
                      <label style={{ display: 'flex', justifyContent: 'space-between', color: '#D4AF37', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                        <span>Hero Foreground Image (Front Frame)</span>
                        <span style={{ fontSize: '10px', color: '#888' }}>Recommended 4:5 Portrait</span>
                      </label>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ width: '64px', height: '80px', borderRadius: '6px', overflow: 'hidden', background: '#000', flexShrink: 0, border: '1px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {aboutSettings.heroImageFront || aboutSettings.founderImage ? (
                            <img src={aboutSettings.heroImageFront || aboutSettings.founderImage} alt="Hero Front" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '10px', color: '#555' }}>No Image</span>
                          )}
                        </div>
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input 
                            type="text" 
                            value={aboutSettings.heroImageFront || ''} 
                            onChange={(e) => setAboutSettings({ ...aboutSettings, heroImageFront: e.target.value })} 
                            placeholder="/hero-model.png"
                          />
                          <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
                            <button type="button" className={styles.btnUpload} style={{ padding: '6px 14px', fontSize: '11px' }}>
                              {uploadingKey === 'about-heroImageFront' ? `Uploading ${uploadPercent}%` : 'Upload Front Image'}
                            </button>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'about-heroImageFront', (url) => setAboutSettings((prev: any) => ({ ...prev, heroImageFront: url })))}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Our Story Card */}
                  <div className={styles.formCard} style={{ borderRadius: '12px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>2. Our Story & Quote</h3>
                    <div className={styles.inputGroup}>
                      <label>Story Section Heading</label>
                      <input 
                        type="text" 
                        value={aboutSettings.storyTitle || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, storyTitle: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Story First Paragraph</label>
                      <textarea 
                        value={aboutSettings.storyText1 || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, storyText1: e.target.value })} 
                        required 
                        style={{ minHeight: '100px' }}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Story Second Paragraph</label>
                      <textarea 
                        value={aboutSettings.storyText2 || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, storyText2: e.target.value })} 
                        required 
                        style={{ minHeight: '100px' }}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Highlighted Editorial Quote</label>
                      <textarea 
                        value={aboutSettings.storyQuote || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, storyQuote: e.target.value })} 
                        required 
                        style={{ minHeight: '80px' }}
                      />
                    </div>
                  </div>

                  {/* 3. Safeguarding Policy Card */}
                  <div className={styles.formCard} style={{ borderRadius: '12px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>3. Safeguarding Credentials</h3>
                    <div className={styles.inputGroup}>
                      <label>Safeguarding Section Title</label>
                      <input 
                        type="text" 
                        value={aboutSettings.safeguardingTitle || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, safeguardingTitle: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Safeguarding Policy Summary</label>
                      <textarea 
                        value={aboutSettings.safeguardingText || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, safeguardingText: e.target.value })} 
                        required 
                        style={{ minHeight: '100px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Mission & Founder */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  
                  {/* 4. Academy Mission Card */}
                  <div className={styles.formCard} style={{ borderRadius: '12px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>4. Academy Mission & Showcase</h3>
                    <div className={styles.inputGroup}>
                      <label>Mission Title</label>
                      <input 
                        type="text" 
                        value={aboutSettings.missionTitle || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, missionTitle: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Mission Description Text</label>
                      <textarea 
                        value={aboutSettings.missionText || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, missionText: e.target.value })} 
                        required 
                        style={{ minHeight: '100px' }}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label style={{ display: 'flex', justifyContent: 'space-between', color: '#D4AF37', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                        <span>Mission Section Showcase Image</span>
                        <span style={{ fontSize: '10px', color: '#888' }}>Campus/Studio Showcase</span>
                      </label>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', background: '#000', flexShrink: 0, border: '1px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {aboutSettings.missionImage ? (
                            <img src={aboutSettings.missionImage} alt="Mission Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '10px', color: '#555' }}>No Image</span>
                          )}
                        </div>
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input 
                            type="text" 
                            value={aboutSettings.missionImage || ''} 
                            onChange={(e) => setAboutSettings({ ...aboutSettings, missionImage: e.target.value })} 
                            required 
                            placeholder="/about-models.png"
                          />
                          <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
                            <button type="button" className={styles.btnUpload} style={{ padding: '6px 14px', fontSize: '11px' }}>
                              {uploadingKey === 'about-missionImage' ? `Uploading ${uploadPercent}%` : 'Upload Mission Image'}
                            </button>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'about-missionImage', (url) => setAboutSettings((prev: any) => ({ ...prev, missionImage: url })))}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. Founder Spotlight Profile Card */}
                  <div className={styles.formCard} style={{ borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.15)', background: 'rgba(255,255,255,0.015)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', color: '#ffffff', fontWeight: '700' }}>5. Founder Spotlight Profile</h3>
                      <span style={{ fontSize: '10px', background: 'rgba(212,175,55,0.1)', color: '#D4AF37', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Vogue Spotlight</span>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Founder Name</label>
                      <input 
                        type="text" 
                        value={aboutSettings.founderName || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, founderName: e.target.value })} 
                        required 
                        placeholder="JULIA MARSE"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Founder Subtitle & Roles</label>
                      <input 
                        type="text" 
                        value={aboutSettings.founderTitle || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, founderTitle: e.target.value })} 
                        required 
                        placeholder="International Fashion Photographer..."
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Founder Bio Paragraph 1</label>
                      <textarea 
                        value={aboutSettings.founderBio1 || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, founderBio1: e.target.value })} 
                        required 
                        style={{ minHeight: '90px' }}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Founder Bio Paragraph 2</label>
                      <textarea 
                        value={aboutSettings.founderBio2 || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, founderBio2: e.target.value })} 
                        required 
                        style={{ minHeight: '90px' }}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Founder Signature Text</label>
                      <input 
                        type="text" 
                        value={aboutSettings.founderSignature || ''} 
                        onChange={(e) => setAboutSettings({ ...aboutSettings, founderSignature: e.target.value })} 
                        required 
                        placeholder="Julia Marse"
                      />
                    </div>

                    {/* Founder Image Input with Thumbnail Preview */}
                    <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
                      <label style={{ display: 'flex', justifyContent: 'space-between', color: '#D4AF37', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                        <span>Founder Portrait Image</span>
                        <span style={{ fontSize: '10px', color: '#888' }}>High Resolution Portrait</span>
                      </label>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ width: '64px', height: '80px', borderRadius: '6px', overflow: 'hidden', background: '#000', flexShrink: 0, border: '1px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {aboutSettings.founderImage ? (
                            <img src={aboutSettings.founderImage} alt="Founder Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '10px', color: '#555' }}>No Image</span>
                          )}
                        </div>
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input 
                            type="text" 
                            value={aboutSettings.founderImage || ''} 
                            onChange={(e) => setAboutSettings({ ...aboutSettings, founderImage: e.target.value })} 
                            required 
                            placeholder="/hero-model.png"
                          />
                          <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
                            <button type="button" className={styles.btnUpload} style={{ padding: '6px 14px', fontSize: '11px' }}>
                              {uploadingKey === 'about-founderImage' ? `Uploading ${uploadPercent}%` : 'Upload Founder Portrait'}
                            </button>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'about-founderImage', (url) => setAboutSettings((prev: any) => ({ ...prev, founderImage: url })))}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              <div style={{ marginTop: '36px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className={styles.btnSave} style={{ minWidth: '220px', padding: '12px 24px', fontSize: '14px', fontWeight: '700' }}>
                  Save All About Us Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Student Portfolio & Assessment Modal */}
      {selectedStudentForPortfolio && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          color: '#ffffff'
        }}>
          <div style={{
            background: '#0d0d0d',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#D4AF37' }}>Student Grading & Portfolio</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888' }}>
                  Evaluate {selectedStudentForPortfolio.fullName} & manage their photoshoot results
                </p>
              </div>
              <button 
                onClick={() => setSelectedStudentForPortfolio(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                &times;
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveStudentPortfolio} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Profile Details summary */}
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '10px',
                padding: '16px'
              }}>
                <img 
                  src={selectedStudentForPortfolio.photo || '/logo.png'} 
                  alt="Student Avatar" 
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #D4AF37' }} 
                />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#fff' }}>{selectedStudentForPortfolio.fullName}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                    Email: {selectedStudentForPortfolio.email} • Age: {new Date().getFullYear() - new Date(selectedStudentForPortfolio.dob).getFullYear()} yrs
                  </p>
                </div>
              </div>

              {/* Slider for Rating */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#ccc' }}>
                  Creative Talent & Performance Rating: <span style={{ color: '#D4AF37', fontWeight: '800' }}>{studentPortfolioRating} / 100</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={studentPortfolioRating}
                    onChange={(e) => setStudentPortfolioRating(Number(e.target.value))}
                    style={{ flexGrow: 1, accentColor: '#D4AF37', height: '6px', borderRadius: '3px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Evaluation Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#ccc' }}>Academic Board & Coach Notes</label>
                <textarea 
                  value={studentPortfolioNotes}
                  onChange={(e) => setStudentPortfolioNotes(e.target.value)}
                  placeholder="Describe student performance, runway confidence, model posing skills, creative direction input, styling capability..."
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '12px 16px',
                    minHeight: '100px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              {/* Photoshoot Results uploads */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#ccc' }}>Photoshoot Portfolio ({studentPortfolioPhotos.length} images)</label>
                  
                  {/* File Upload Button */}
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      id="portfolio-file-input"
                      onChange={(e) => handleFileUpload(e, 'portfolio-photo', (url) => {
                        setStudentPortfolioPhotos(prev => [...prev, url]);
                      })}
                      style={{ display: 'none' }}
                    />
                    <label 
                      htmlFor="portfolio-file-input"
                      style={{
                        background: '#D4AF37',
                        color: '#000',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'inline-block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        transition: 'opacity 0.2s'
                      }}
                    >
                      {uploadingKey === 'portfolio-photo' ? `Uploading ${uploadPercent}%` : '+ Upload Photo'}
                    </label>
                  </div>
                </div>

                {/* Uploaded photos grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '12px',
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  padding: '16px',
                  minHeight: '120px'
                }}>
                  {studentPortfolioPhotos.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '12px' }}>
                      No photoshoot results uploaded yet. Use the upload button to add images.
                    </div>
                  ) : (
                    studentPortfolioPhotos.map((url, index) => (
                      <div key={index} style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <img src={url} alt="Portfolio Asset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => setStudentPortfolioPhotos(prev => prev.filter((_, i) => i !== index))}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(239, 68, 68, 0.9)',
                            border: 'none',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '20px',
                marginTop: '10px'
              }}>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForPortfolio(null)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ccc',
                    borderRadius: '30px',
                    padding: '10px 24px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPortfolio}
                  style={{
                    background: '#ffffff',
                    border: 'none',
                    color: '#000000',
                    borderRadius: '30px',
                    padding: '10px 32px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {isSavingPortfolio ? 'Saving...' : 'Save Portfolio & Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 15. COMPREHENSIVE STUDENT DETAILS MODAL */}
      {selectedStudentForView && (() => {
        const student = selectedStudentForView;
        const matchedCohort = cohorts.find(c => c.id === student.cohortId);
        
        // Fetch Billing history
        const studentTxs = transactions.filter(t => t.email.toLowerCase() === student.email.toLowerCase());
        const totalPaidAmount = studentTxs.reduce((sum, tx) => {
          const num = parseInt(tx.amount.replace(/[^0-9]/g, ''), 10) || 0;
          return sum + num;
        }, 0);

        // Fetch Attendance stats
        let presentCount = 0;
        let absentCount = 0;
        let excusedCount = 0;
        const attendanceLogsForStudent: any[] = [];
        
        attendanceLogs.forEach(log => {
          if (log.records) {
            const record = log.records.find((r: any) => r.studentId === student.id);
            if (record) {
              attendanceLogsForStudent.push({ date: log.date, status: record.status });
              if (record.status === 'PRESENT') presentCount++;
              else if (record.status === 'ABSENT') absentCount++;
              else if (record.status === 'EXCUSED') excusedCount++;
            }
          }
        });

        const totalAttendanceClasses = presentCount + absentCount + excusedCount;
        const attendanceRate = totalAttendanceClasses > 0 
          ? Math.round(((presentCount + excusedCount) / totalAttendanceClasses) * 100) 
          : 100;

        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            color: '#ffffff'
          }}>
            <div style={{
              background: '#0d0d0d',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '900px',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#D4AF37' }}>Comprehensive Student File</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888' }}>
                    Full administrative record & performance profile
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedStudentForView(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#888',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Main Content Grid */}
              <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                
                {/* Left Column: Personal details & Guardian info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Photo & Identity Section */}
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: '10px',
                    padding: '16px'
                  }}>
                    <img 
                      src={student.photo || '/logo.png'} 
                      alt="Student" 
                      style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }} 
                    />
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>{student.fullName}</h4>
                      <span className={
                        student.status === 'APPROVED' ? styles.statusBadgeApproved :
                        student.status === 'PENDING' ? styles.statusBadgePending :
                        styles.statusBadgeRejected
                      }
                      style={{ fontSize: '10px' }}
                      >
                        {student.status}
                      </span>
                      <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#555' }}>
                        Registered: {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Portal Access Credentials Box for Admin */}
                  <div style={{
                    background: 'rgba(212, 175, 55, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '10px',
                    padding: '16px',
                    color: '#ffffff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        🔑 Portal Access Credentials
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          onClick={() => {
                            const pass = student.password || `Marse2026!${student.id ? student.id.slice(-3) : '789'}`;
                            navigator.clipboard.writeText(pass);
                            showToast(`Copied password "${pass}" to clipboard!`, 'success');
                          }}
                          style={{
                            background: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '10px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          📋 Copy Password Only
                        </button>
                        <button 
                          onClick={() => {
                            const pass = student.password || `Marse2026!${student.id ? student.id.slice(-3) : '789'}`;
                            const creds = `Portal Link: ${window.location.origin}/portal\nStudent ID: MA-2026-${student.id ? student.id.slice(-3) : '089'}\nLogin Email: ${student.email}\nPassword: ${pass}`;
                            navigator.clipboard.writeText(creds);
                            showToast('Copied full credentials to clipboard!', 'success');
                          }}
                          style={{
                            background: '#D4AF37',
                            color: '#000000',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '10px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Copy Full Info
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '12.5px', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div><span style={{ color: '#888' }}>Student ID:</span> <strong style={{ color: '#fff' }}>MA-2026-{student.id ? student.id.slice(-3) : '089'}</strong></div>
                      <div><span style={{ color: '#888' }}>Login Email:</span> <strong style={{ color: '#fff' }}>{student.email}</strong></div>
                      <div><span style={{ color: '#888' }}>Access Password:</span> <strong style={{ color: '#10b981' }}>{student.password || `Marse2026!${student.id ? student.id.slice(-3) : '789'}`}</strong></div>
                    </div>
                  </div>

                  {/* Personal Data Sheet */}
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personal Information</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '8px 0', color: '#555' }}>Preferred Name</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{student.preferredName || student.fullName}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '8px 0', color: '#555' }}>Primary Email</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{student.email}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '8px 0', color: '#555' }}>Phone Number</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{student.phone || 'N/A'}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '8px 0', color: '#555' }}>Date of Birth</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{new Date(student.dob).toLocaleDateString()}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '8px 0', color: '#555' }}>Age / Class Tier</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>
                            {new Date().getFullYear() - new Date(student.dob).getFullYear()} yrs old
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '8px 0', color: '#555' }}>Education Level</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{student.educationLevel}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '8px 0', color: '#555' }}>Assigned Class Cohort</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold', color: '#D4AF37' }}>
                            {matchedCohort ? matchedCohort.name : 'Unassigned'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Guardian Info (minor validation) */}
                  {student.guardianName ? (
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guardian / Parental Information</h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '8px 0', color: '#555' }}>Guardian Name</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{student.guardianName}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '8px 0', color: '#555' }}>Guardian Email</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{student.guardianEmail}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '8px 0', color: '#555' }}>Guardian Phone</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{student.guardianPhone}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.04)', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                      Adult Application: No parent/guardian information required.
                    </div>
                  )}
                </div>

                {/* Right Column: Attendance, Payments, Portfolio & Grade */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Performance & Academic Grades */}
                  <div style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.02)',
                    border: '1px solid rgba(212, 175, 55, 0.1)',
                    borderRadius: '10px',
                    padding: '16px'
                  }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Academic Performance</span>
                      <span style={{ fontWeight: '800' }}>Score: {student.evaluationRating || 0} / 100</span>
                    </h4>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#aaa', fontStyle: 'italic', lineHeight: '1.5' }}>
                      "{student.evaluationNotes || 'No notes documented by coaches yet.'}"
                    </p>
                  </div>

                  {/* Attendance Summary */}
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Class Attendance</span>
                      <span style={{ color: attendanceRate >= 80 ? '#10b981' : '#ef4444' }}>Rate: {attendanceRate}%</span>
                    </h4>
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ flex: 1, backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981' }}>{presentCount}</div>
                        <div style={{ fontSize: '10px', color: '#666' }}>Present</div>
                      </div>
                      <div style={{ flex: 1, backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ef4444' }}>{absentCount}</div>
                        <div style={{ fontSize: '10px', color: '#666' }}>Absent</div>
                      </div>
                      <div style={{ flex: 1, backgroundColor: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#f59e0b' }}>{excusedCount}</div>
                        <div style={{ fontSize: '10px', color: '#666' }}>Excused</div>
                      </div>
                    </div>

                    {/* mini logs list */}
                    <div style={{ maxHeight: '80px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '4px' }}>
                      {attendanceLogsForStudent.length === 0 ? (
                        <span style={{ fontSize: '11px', color: '#555', fontStyle: 'italic' }}>No attendance sheets generated for this student.</span>
                      ) : (
                        attendanceLogsForStudent.map((entry, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                            <span>{new Date(entry.date).toLocaleDateString()}</span>
                            <span style={{ 
                              color: entry.status === 'PRESENT' ? '#10b981' : entry.status === 'ABSENT' ? '#ef4444' : '#f59e0b',
                              fontWeight: 'bold'
                            }}>{entry.status}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Financial & Billing logs */}
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Billing & Revenue logs</span>
                      <span style={{ color: '#D4AF37' }}>Total Paid: ${totalPaidAmount.toLocaleString()}</span>
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '100px', overflowY: 'auto', paddingRight: '4px' }}>
                      {studentTxs.length === 0 ? (
                        <div style={{ fontSize: '12px', color: '#666', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                          No successful payments captured yet.
                        </div>
                      ) : (
                        studentTxs.map((tx) => (
                          <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                            <div>
                              <strong style={{ color: '#ffffff' }}>{tx.planName}</strong><br/>
                              <span style={{ fontSize: '10px', color: '#555', fontFamily: 'monospace' }}>Tx: {tx.id}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <strong style={{ color: '#10b981' }}>{tx.amount}</strong><br/>
                              <span style={{ fontSize: '10px', color: '#666' }}>{new Date(tx.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Photoshoot Gallery Grid */}
              <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Photoshoot Portfolio Gallery</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: '12px',
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  padding: '16px'
                }}>
                  {(!student.portfolioPhotos || student.portfolioPhotos.length === 0) ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#555', fontSize: '12px', padding: '12px 0' }}>
                      No photoshoot results loaded for this student. Use the Portfolio button to add image assets.
                    </div>
                  ) : (
                    student.portfolioPhotos.map((url: string, index: number) => (
                      <a href={url} target="_blank" rel="noopener noreferrer" key={index} style={{ display: 'block', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', aspectRatio: '1/1' }}>
                        <img src={url} alt="Photoshoot Result" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' }} />
                      </a>
                    ))
                  )}
                </div>
              </div>

              {/* Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '16px 24px',
                backgroundColor: 'rgba(255,255,255,0.01)',
                borderTop: '1px solid rgba(255,255,255,0.06)'
              }}>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForView(null)}
                  style={{
                    background: '#ffffff',
                    border: 'none',
                    color: '#000000',
                    borderRadius: '30px',
                    padding: '8px 24px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Close File
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* 16. LIVE HERO POSITION PREVIEW MODAL (UPGRADED WORKSTATION) */}
      {showHeroPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#070707',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'row',
          color: '#ffffff',
          fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
          {/* Main workspace (Canvas + Top bar) */}
          <div style={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0c0c0e',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1.5px, transparent 0)',
            backgroundSize: '24px 24px',
            position: 'relative'
          }}>
            {/* Top Toolbar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 28px',
              backgroundColor: '#0f0f12',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              zIndex: 100
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#D4AF37', fontWeight: 'bold' }}>Marse Workstation</span>
                  <span style={{ fontSize: '9px', background: 'rgba(212,175,55,0.15)', color: '#D4AF37', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.3)', fontWeight: 'bold' }}>PRO ENGINE V2.0</span>
                </div>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>Media Focal & Contrast Studio</h3>
              </div>
              
              {/* Quick status coordinates */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#888', fontFamily: 'monospace' }}>
                  <span>X: <strong style={{ color: '#D4AF37' }}>{heroSettings.mediaPositionX || '50%'}</strong></span>
                  <span>|</span>
                  <span>Y: <strong style={{ color: '#D4AF37' }}>{heroSettings.mediaPositionY || '50%'}</strong></span>
                  <span>|</span>
                  <span>Zoom: <strong style={{ color: '#D4AF37' }}>{Number(heroSettings.mediaScale || 1.0).toFixed(2)}x</strong></span>
                  <span>|</span>
                  <span>Overlay: <strong style={{ color: '#D4AF37' }}>{Math.round((heroSettings.mediaOverlay ?? 0.4) * 100)}%</strong></span>
                </div>
              </div>
            </div>

            {/* Canvas workspace hosting the simulated viewports */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              position: 'relative',
              overflow: 'auto'
            }}>
              {/* Responsive Device Frame Container */}
              <div style={{
                width: viewportMode === 'desktop' ? '100%' : viewportMode === 'tablet' ? '768px' : '375px',
                height: viewportMode === 'desktop' ? '100%' : viewportMode === 'tablet' ? '85vh' : '80vh',
                maxWidth: '100%',
                maxHeight: '100%',
                backgroundColor: '#070707',
                border: viewportMode === 'desktop' ? 'none' : '12px solid #1c1c22',
                borderRadius: viewportMode === 'desktop' ? '0' : viewportMode === 'tablet' ? '28px' : '32px',
                boxShadow: viewportMode === 'desktop' ? 'none' : '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: viewportMode === 'desktop' ? 'row' : 'column',
                alignItems: 'stretch',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxSizing: 'content-box'
              }}>
                {/* Simulated Hero Layout - Left Side (Brand Copy) */}
                <div style={{
                  width: viewportMode === 'desktop' ? '48%' : '100%',
                  height: viewportMode === 'desktop' ? '100%' : 'auto',
                  minHeight: viewportMode === 'desktop' ? 'auto' : '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: viewportMode === 'mobile' ? '30px 20px' : '40px',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  backgroundColor: '#070707',
                  borderRight: viewportMode === 'desktop' ? '1px solid rgba(255,255,255,0.03)' : 'none',
                  borderBottom: viewportMode === 'desktop' ? 'none' : '1px solid rgba(255,255,255,0.03)',
                  zIndex: 20
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '300' }}>M</span>
                    <span style={{ opacity: 1, fontSize: '18px' }}>|</span>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '300' }}>A</span>
                  </div>
                  
                  <h1 style={{ fontFamily: 'Georgia, serif', fontSize: viewportMode === 'mobile' ? '20px' : '26px', fontWeight: '700', letterSpacing: '0.24em', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
                    {heroSettings.title || 'MARSE'}
                  </h1>
                  
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: viewportMode === 'mobile' ? '11px' : '13px', fontWeight: '400', letterSpacing: '0.15em', margin: '0 0 16px 0', color: '#ffffff', lineHeight: '1.5' }}>
                    {(heroSettings.description || '').split('\n').map((line: string, idx: number) => (
                      <span key={idx}>
                        {line}
                        {idx < (heroSettings.description || '').split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </h2>
                  
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: '600', letterSpacing: '0.2em', color: '#ffffff', textTransform: 'uppercase', marginBottom: '24px' }}>
                    SHAPING TALENT. CREATING FUTURES.
                  </p>
                  
                  <div style={{ border: '1px solid #ffffff', padding: '10px 24px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'default' }}>
                    Discover Our Programs
                  </div>
                </div>

                {/* Simulated Hero Layout - Right Side (Drag/Reposition Media Area) */}
                <div 
                  ref={mediaContainerRef}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleMediaDragStart(e.clientX, e.clientY);
                  }}
                  onMouseMove={(e) => {
                    handleMediaDragMove(e.clientX, e.clientY);
                  }}
                  onMouseUp={handleMediaDragEnd}
                  onMouseLeave={handleMediaDragEnd}
                  onTouchStart={(e) => {
                    handleMediaDragStart(e.touches[0].clientX, e.touches[0].clientY);
                  }}
                  onTouchMove={(e) => {
                    handleMediaDragMove(e.touches[0].clientX, e.touches[0].clientY);
                  }}
                  onTouchEnd={handleMediaDragEnd}
                  style={{ 
                    flex: 1,
                    position: 'relative', 
                    overflow: 'hidden',
                    cursor: isDraggingMedia ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    backgroundColor: '#000000',
                    minHeight: viewportMode === 'desktop' ? 'auto' : '360px'
                  }}
                >
                  {/* Dynamic media renderer */}
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    {(() => {
                      const isVid = heroSettings.mediaType === 'VIDEO' || (!heroSettings.mediaType && heroSettings.videoUrl && (
                        heroSettings.videoUrl.endsWith('.mp4') || heroSettings.videoUrl.endsWith('.webm')
                      ));
                      const src = isVid ? (heroSettings.videoUrl || '/vienna-makeup-hair.mp4') : (heroSettings.imageUrl || '/hero-model.png');
                      const stylesObj = { 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' as const, 
                        objectPosition: `${heroSettings.mediaPositionX || '50%'} ${heroSettings.mediaPositionY || '50%'}`,
                        transform: `scale(${heroSettings.mediaScale || 1.0})`,
                        transition: isDraggingMedia ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), object-position 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                      };
                      return isVid ? (
                        <video src={src} autoPlay muted loop playsInline style={stylesObj} />
                      ) : (
                        <img src={src} alt="Hero background" style={stylesObj} />
                      );
                    })()}

                    {/* Adjustable solid black overlay darkness */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: '#000000',
                      opacity: heroSettings.mediaOverlay !== undefined ? heroSettings.mediaOverlay : 0.4,
                      zIndex: 8,
                      transition: 'opacity 0.25s ease'
                    }} />

                    {/* Dynamic edge blending gradient matching actual website */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: viewportMode === 'desktop'
                        ? 'linear-gradient(to right, rgba(7,7,7,1) 0%, rgba(7,7,7,0.2) 25%, rgba(7,7,7,0) 100%)'
                        : 'linear-gradient(to bottom, rgba(7,7,7,0.8) 0%, rgba(7,7,7,0.1) 40%, rgba(7,7,7,0.9) 100%)',
                      zIndex: 10
                    }}></div>
                  </div>

                  {/* 1. Rule-of-Thirds Grid Overlay */}
                  {showGrid && (
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12 }}>
                      {/* Vertical lines */}
                      <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: '1px', borderLeft: '1px dashed rgba(212,175,55,0.4)', boxShadow: '0 0 2px rgba(0,0,0,0.8)' }} />
                      <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: '1px', borderLeft: '1px dashed rgba(212,175,55,0.4)', boxShadow: '0 0 2px rgba(0,0,0,0.8)' }} />
                      {/* Horizontal lines */}
                      <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: '1px', borderTop: '1px dashed rgba(212,175,55,0.4)', boxShadow: '0 0 2px rgba(0,0,0,0.8)' }} />
                      <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: '1px', borderTop: '1px dashed rgba(212,175,55,0.4)', boxShadow: '0 0 2px rgba(0,0,0,0.8)' }} />
                    </div>
                  )}

                  {/* 2. Camera Focal Point Target Reticle */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90px',
                    height: '90px',
                    pointerEvents: 'none',
                    zIndex: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Camera view finder corners */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '14px', height: '14px', borderTop: '2px solid #D4AF37', borderLeft: '2px solid #D4AF37', filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))' }} />
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '14px', height: '14px', borderTop: '2px solid #D4AF37', borderRight: '2px solid #D4AF37', filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '14px', height: '14px', borderBottom: '2px solid #D4AF37', borderLeft: '2px solid #D4AF37', filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '14px', height: '14px', borderBottom: '2px solid #D4AF37', borderRight: '2px solid #D4AF37', filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))' }} />
                    
                    {/* Ring and dot */}
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D4AF37', boxShadow: '0 0 8px #D4AF37' }} />
                    </div>

                    {/* Coordinates box */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-28px',
                      backgroundColor: 'rgba(7,7,9,0.85)',
                      backdropFilter: 'blur(4px)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '9px',
                      fontFamily: 'monospace',
                      color: '#D4AF37',
                      whiteSpace: 'nowrap',
                      border: '1px solid rgba(212,175,55,0.25)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                      letterSpacing: '0.5px'
                    }}>
                      FOCAL: {heroSettings.mediaPositionX || '50%'}, {heroSettings.mediaPositionY || '50%'}
                    </div>
                  </div>

                  {/* Drag notice bar */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(7,7,9,0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '8px 16px',
                    borderRadius: '30px',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#e4e4e7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 15,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                    pointerEvents: 'none',
                    letterSpacing: '0.5px'
                  }}>
                    <span style={{ color: '#D4AF37', fontSize: '13px' }}>✥</span>
                    DRAG ANYWHERE ON MEDIA TO ADJUST FOCAL POINT
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Control Panel HUD */}
          <div style={{
            width: '360px',
            height: '100%',
            backgroundColor: '#0d0d10',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 101,
            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
          }}>
            {/* HUD Title */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              <h4 style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#888' }}>Control Dashboard</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#ccc' }}>Realtime layout workspace configuration</p>
            </div>

            {/* HUD Content Controls */}
            <div style={{
              flex: 1,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              overflowY: 'auto'
            }}>
              
              {/* SECTION 1: VIEWPORT DEVICE SIMULATOR */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888', marginBottom: '10px', fontWeight: '700' }}>
                  Viewport Simulation
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  padding: '4px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <button 
                    type="button"
                    onClick={() => setViewportMode('desktop')}
                    style={{
                      background: viewportMode === 'desktop' ? '#D4AF37' : 'transparent',
                      border: 'none',
                      color: viewportMode === 'desktop' ? '#000000' : '#ffffff',
                      borderRadius: '6px',
                      padding: '8px 0',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span>💻</span>
                    <span>Desktop</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setViewportMode('tablet')}
                    style={{
                      background: viewportMode === 'tablet' ? '#D4AF37' : 'transparent',
                      border: 'none',
                      color: viewportMode === 'tablet' ? '#000000' : '#ffffff',
                      borderRadius: '6px',
                      padding: '8px 0',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span>📱</span>
                    <span>Tablet</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setViewportMode('mobile')}
                    style={{
                      background: viewportMode === 'mobile' ? '#D4AF37' : 'transparent',
                      border: 'none',
                      color: viewportMode === 'mobile' ? '#000000' : '#ffffff',
                      borderRadius: '6px',
                      padding: '8px 0',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span>📲</span>
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* SECTION 2: SUBJECT ALIGNMENT GRIDS */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888', marginBottom: '10px', fontWeight: '700' }}>
                  Camera Assist Overlays
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowGrid(!showGrid)}
                    style={{
                      width: '100%',
                      background: showGrid ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.02)',
                      border: showGrid ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      color: showGrid ? '#D4AF37' : '#ffffff',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>#</span> Rule of Thirds Grid
                    </span>
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>{showGrid ? 'ACTIVE' : 'OFF'}</span>
                  </button>
                </div>
              </div>

              {/* SECTION 3: FOCAL COORDINATES */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888', marginBottom: '12px', fontWeight: '700' }}>
                  Focal Coordinates (Drag / Sliders)
                </label>
                
                {/* X Coordinate */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ccc', marginBottom: '6px' }}>
                    <span>X Offset (Left ↔ Right)</span>
                    <span style={{ fontFamily: 'monospace', color: '#D4AF37', fontWeight: 'bold' }}>{heroSettings.mediaPositionX || '50%'}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={parseInt(heroSettings.mediaPositionX || '50', 10)} 
                    onChange={(e) => setHeroSettings((prev: any) => ({ ...prev, mediaPositionX: e.target.value + '%' }))}
                    style={{ width: '100%', accentColor: '#D4AF37', cursor: 'ew-resize' }}
                  />
                </div>

                {/* Y Coordinate */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ccc', marginBottom: '6px' }}>
                    <span>Y Offset (Top ↔ Bottom)</span>
                    <span style={{ fontFamily: 'monospace', color: '#D4AF37', fontWeight: 'bold' }}>{heroSettings.mediaPositionY || '50%'}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={parseInt(heroSettings.mediaPositionY || '50', 10)} 
                    onChange={(e) => setHeroSettings((prev: any) => ({ ...prev, mediaPositionY: e.target.value + '%' }))}
                    style={{ width: '100%', accentColor: '#D4AF37', cursor: 'ns-resize' }}
                  />
                </div>
              </div>

              {/* SECTION 4: ZOOM SCALE */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888', fontWeight: '700' }}>
                    Media Scale (Zoom)
                  </label>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#D4AF37', fontWeight: 'bold' }}>
                    {Number(heroSettings.mediaScale || 1.0).toFixed(2)}x
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="2.5" 
                  step="0.05"
                  value={heroSettings.mediaScale || 1.0} 
                  onChange={(e) => setHeroSettings((prev: any) => ({ ...prev, mediaScale: parseFloat(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#D4AF37', cursor: 'zoom-in' }}
                />
              </div>

              {/* SECTION 5: DARK OVERLAY ADJUSTMENT */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888', fontWeight: '700' }}>
                    Overlay Opacity (Darkness)
                  </label>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#D4AF37', fontWeight: 'bold' }}>
                    {Math.round((heroSettings.mediaOverlay ?? 0.4) * 100)}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="0.95" 
                  step="0.05"
                  value={heroSettings.mediaOverlay !== undefined ? heroSettings.mediaOverlay : 0.4} 
                  onChange={(e) => setHeroSettings((prev: any) => ({ ...prev, mediaOverlay: parseFloat(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#D4AF37', cursor: 'pointer' }}
                />
                <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#666', lineHeight: '1.4' }}>
                  Darkens media background to ensure text elements are readable.
                </p>
              </div>

              {/* SECTION 6: QUICK PRESETS */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888', marginBottom: '8px', fontWeight: '700' }}>
                  Workstation Presets
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button 
                    type="button"
                    onClick={() => setHeroSettings((prev: any) => ({ ...prev, mediaPositionX: '50%', mediaPositionY: '50%' }))}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      color: '#ffffff',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                  >
                    Center Offsets
                  </button>
                  <button 
                    type="button"
                    onClick={() => setHeroSettings((prev: any) => ({ 
                      ...prev, 
                      mediaPositionX: '50%', 
                      mediaPositionY: '50%',
                      mediaScale: 1.0,
                      mediaOverlay: 0.4
                    }))}
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.15)',
                      color: '#ef4444',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  >
                    Reset System
                  </button>
                </div>
              </div>

            </div>

            {/* HUD Footer Action buttons */}
            <div style={{
              padding: '24px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              backgroundColor: '#09090c'
            }}>
              <button
                type="button"
                onClick={() => setShowHeroPreview(false)}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: 'none',
                  color: '#000000',
                  borderRadius: '30px',
                  padding: '12px 0',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.1)'
                }}
              >
                Apply Parameters & Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowHeroPreview(false);
                  loadAllData(); // Reload original settings to discard unsaved updates
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#888',
                  borderRadius: '30px',
                  padding: '10px 0',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#888';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
              >
                Discard Unsaved Parameters
              </button>
            </div>

          </div>
        </div>
      )}

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
