import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Presentation from './components/Presentation';
import Programs from './components/Programs';
import WhyChooseMarse from './components/WhyChooseMarse';
import CoreSubjects from './components/CoreSubjects';
import StudentJourney from './components/StudentJourney';
import Gallery from './components/Gallery';
import Team from './components/Team';
import Testimonials from './components/Testimonials';
import Enrollment from './components/Enrollment';
import FAQs from './components/FAQs';
import JoinCollective from './components/JoinCollective';
import Footer from './components/Footer';
import styles from './page.module.css';
import { 
  getHeroSettings,
  getAboutSettings,
  getPrograms,
  getCoreSubjects,
  getJourneySteps,
  getBentoGallery,
  getMentors,
  getTestimonials,
  getPricingPlans,
  getFAQs,
  getGlobalSettings
} from '@/lib/db';

export default async function Home() {
  const [
    heroSettings,
    aboutSettings,
    programs,
    coreSubjects,
    journeySteps,
    bentoGallery,
    mentors,
    testimonials,
    pricingPlans,
    faqs,
    globalSettings
  ] = await Promise.all([
    getHeroSettings(),
    getAboutSettings(),
    getPrograms(),
    getCoreSubjects(),
    getJourneySteps(),
    getBentoGallery(),
    getMentors(),
    getTestimonials(),
    getPricingPlans(),
    getFAQs(),
    getGlobalSettings()
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "MARSE Academy of Fashion & Arts",
    "url": "https://marse-academy.com",
    "logo": "https://marse-academy.com/logo.png",
    "description": "Premium creative institution merging fashion design, modeling, performing arts, and photography to train creative leaders.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "United Kingdom"
    },
    "founder": {
      "@type": "Person",
      "name": "Julia Marse"
    },
    "sameAs": [
      "https://instagram.com",
      "https://tiktok.com",
      "https://youtube.com",
      "https://pinterest.com"
    ]
  };

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      
      <div className={styles.content}>
        <Hero initialData={heroSettings} />
        <Presentation initialData={aboutSettings} />
        <Programs initialData={programs} />
        <WhyChooseMarse />
        <CoreSubjects initialData={coreSubjects} />
        <StudentJourney initialData={journeySteps} />
        <Gallery initialData={bentoGallery} />
        <Team initialData={mentors} />
        <Testimonials initialData={testimonials} />
        <Enrollment initialData={pricingPlans} initialSettings={globalSettings} />
        <FAQs initialData={faqs} />
        <JoinCollective />
      </div>
      
      <Footer />
    </main>
  );
}
