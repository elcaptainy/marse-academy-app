# 🏛️ MARSE ACADEMY OF FASHION & ARTS • LONDON
> **Official Executive Web Application & Student Admission Platform**

![Next.js 15](https://img.shields.io/badge/Next.js-15_App_Router-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Stripe](https://img.shields.io/badge/Stripe_API-Live_Integrated-6772E5?style=for-the-badge&logo=stripe)
![Deployment](https://img.shields.io/badge/Netlify-Live-00C7B7?style=for-the-badge&logo=netlify)

---

## 📖 Executive Overview

**Marse Academy of Fashion & Arts** is an elite digital platform designed for London's premier fashion, modeling, and creative arts institute. Built with **Next.js 15 (App Router)**, **TypeScript**, and **Vanilla CSS Modules**, the application delivers a bespoke, ultra-luxury aesthetic paired with high-performance billing infrastructure, live drag-and-drop CMS management, and automated student onboarding.

---

## 🗺️ Complete Project Architecture Map

```
troy-academy-app/
├── 📁 app/                           # Next.js 15 App Router Main Hierarchy
│   ├── 📁 admin/                     # ELcaptain CMS & Admin Dashboard
│   │   ├── page.tsx                  # Live Drag & Reposition Control Suite
│   │   └── admin.module.css          # Dark Obsidian Luxury Styling
│   ├── 📁 checkout/                  # Domestika-Inspired Accordion Checkout
│   │   ├── page.tsx                  # Stripe & PayPal Accordion Gateway
│   │   ├── checkout.module.css       # Responsive Checkout Layout
│   │   └── 📁 success/               # Post-Payment Receipt & Onboarding
│   │       └── page.tsx              # Receipt Verification & WhatsApp Link
│   ├── 📁 api/                       # RESTful API Backend Routes
│   │   ├── 📁 admin/                 # Auth & Dashboard Management API
│   │   ├── 📁 applications/          # Student Application Submission API
│   │   ├── 📁 checkout/              # Stripe Payment Intents & Session API
│   │   ├── 📁 gallery/               # Bento Gallery & Media API
│   │   ├── 📁 mentors/               # Faculty & Instructors API
│   │   ├── 📁 pricing/               # Academic Pathways & Pricing API
│   │   └── 📁 settings/              # Global Site Configuration API
│   ├── 📁 components/                # Scoped UI Components
│   │   ├── Navbar.tsx                # Glassmorphism Top Navigation
│   │   ├── Footer.tsx                # Brand Footer & Global Stats
│   │   ├── Hero.tsx                  # Video Background & Hero Title
│   │   ├── Team.tsx                  # Faculty Mentors Grid
│   │   ├── Pricing.tsx               # Academic Pathways Cards
│   │   └── Testimonials.tsx          # Success Stories & Reviews
│   ├── 📁 programme/                 # Academic Programs Showcase Page
│   ├── 📁 admissions/                # Student Admission Portal
│   ├── 📁 contact/                   # Support & Contact Enquiry Page
│   ├── 📁 faq/                       # Frequently Asked Questions Page
│   ├── 📁 gallery/                   # High-Res Media Gallery
│   ├── 📁 legal/                     # Terms, Privacy & Cookies Policies
│   ├── layout.tsx                    # Root Layout & Font Declarations
│   └── page.tsx                      # Landing Page (Home)
├── 📁 lib/                           # Core Utilities & Backend Engines
│   ├── db.ts                         # Data Access Layer & Fallback Engine
│   ├── mailer.ts                     # Nodemailer Engine & Luxury HTML Templates
│   └── auth.ts                       # JWT Authentication & Cookie Management
├── 📁 types/                         # Centralized TypeScript Contracts
│   └── index.ts                      # Interfaces (StudentApplication, Transaction, etc.)
├── 📁 public/                        # Static Assets & Media Storage
│   ├── 📁 uploads/                   # User-uploaded profile WebP images & videos
│   ├── visa-official.svg             # Official Visa Brand Logo
│   ├── mastercard-official.webp      # Official Mastercard Brand Logo
│   ├── paypal-official.webp          # Official PayPal Brand Logo
│   ├── stripe-official.png           # Official Stripe Brand Logo
│   ├── gpay-official.png             # Official Google Pay Brand Logo
│   └── applepay-official.webp        # Official Apple Pay Brand Logo
├── .env                              # Environment Variables (Secrets & API Keys)
├── netlify.toml                      # Netlify Hosting Build Configuration
├── next.config.ts                    # Next.js Framework Settings
├── package.json                      # Dependencies & Scripts
└── tsconfig.json                     # TypeScript Strict Compiler Settings
```

---

## ⚡ Core Technical Features & Capabilities

### 1. 💳 Domestika-Inspired Accordion Checkout System (`/checkout`)
- **Active Payment Gateways:** Authentic REST API integration for **Stripe PaymentIntents** and **PayPal Express**.
- **Official Brand Logos:** High-resolution vector/WebP logos for Visa, Mastercard, PayPal, Stripe, Apple Pay, and Google Pay.
- **UK Tax Compliance:** Transparent HMRC Education Provision display (`UK VAT Exempt under HMRC Notice 701/30`).
- **Urgency & Trust Seals:** 15-minute seat lock reservation timer and 14-day enrollment money-back protection guarantee.

### 2. 🎛️ `ELcaptain` Live Drag & Reposition Suite (`/admin`)
- **Interactive Reordering:** Live drag-and-reorder controls across 5 core dashboard modules:
  1. Bento Gallery & Media
  2. Mentors & Faculty Members
  3. Academic Pricing Pathways
  4. Student Journey Timeline
  5. Core Pillars of Excellence
- **Data Persistence:** Automatic server synchronization with instant JSON fallback support.

### 3. 📝 Dual-Track Student Journey Pipeline
- **Track 1: Direct Plan Checkout:** For students ready to lock their seat immediately with Stripe/PayPal.
- **Track 2: Admission Application Review:** Multi-step application modal for portfolio evaluation before acceptance.

### 4. 📧 Automated Luxury Email Engine (`lib/mailer.ts`)
- Responsive HTML email templates with gold-embossed headers for application receipts, payment confirmations, and admin notifications dispatched via `marse.academy.support@gmail.com`.

---

## ⚙️ Quick Start & Local Setup

### 1. Prerequisites
- Node.js 18.x or higher
- npm, pnpm, or yarn

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/elcaptainy/marse-academy-app.git
cd marse-academy-app
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Mailer & Support Credentials
ADMIN_EMAIL="marse.academy.support@gmail.com"
ADMIN_PASSWORD="MarseAdmin2026!"
JWT_SECRET="your-jwt-secret-key"

# SMTP Mailer Settings
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="marse.academy.support@gmail.com"
SMTP_PASS="your-16-char-app-password"

# Stripe Payment Gateway Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

### 4. Running Local Dev Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Verification & Build Check

To run TypeScript compilation check:
```bash
npx tsc --noEmit
```

---

## 🌐 Live Production Deployment

- **GitHub Repository:** [https://github.com/elcaptainy/marse-academy-app.git](https://github.com/elcaptainy/marse-academy-app.git)
- **Live Netlify App:** [https://marse-talent.netlify.app](https://marse-talent.netlify.app)
- **Admin Dashboard:** `https://marse-talent.netlify.app/admin`

---

© 2026 **Marse Academy of Fashion & Arts**. All Rights Reserved.  
*London • Vienna • Milan*
