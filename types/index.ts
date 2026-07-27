export interface StudentApplication {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  dob?: string;
  educationLevel?: string;
  interests?: string[];
  guardianName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  photo?: string | null;
  termsAccepted: boolean;
  mediaConsent: boolean;
  medicalConsent: boolean;
  cohortId?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITING_LIST' | 'CONTACTED';
  createdAt: string;
}

export interface BillingTransaction {
  id: string;
  createdAt: string;
  email: string;
  cardName: string;
  cardNumber: string;
  amount: string;
  planName: string;
  status: 'VERIFIED' | 'FAILED' | 'PENDING';
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  isFeatured?: boolean;
  badge?: string;
  order?: number;
  discountBadge?: string;
  quarterlyPrice?: string;
  monthlyPrice?: string;
  allowInstallments?: boolean;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  specialty?: string;
  order?: number;
}

export interface CorePillar {
  id: string;
  title: string;
  description: string;
  icon: string;
  order?: number;
}

export interface GlobalSettings {
  supportWhatsapp: string;
  supportEmail: string;
  showStats: boolean;
  showFooterGallery: boolean;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  pinterestUrl?: string;
}
