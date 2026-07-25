import { promises as fs } from 'fs';
import { join } from 'path';
import prisma from './prisma';
import { 
  fallbackHero, 
  fallbackFeatures, 
  fallbackGallery, 
  fallbackMentors, 
  fallbackPricing, 
  fallbackFAQs, 
  fallbackTestimonials,
  fallbackSubjects,
  fallbackJourneySteps,
  fallbackGlobalSettings,
  fallbackAboutSettings,
  fallbackPrograms
} from './fallbackData';

const JSON_DB_PATH = join(process.cwd(), 'prisma', 'db_fallback.json');

// Delete local file from disk if it starts with /uploads/
export async function deleteFileIfLocal(url: string | null | undefined) {
  if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) return;
  try {
    const filePath = join(process.cwd(), 'public', url);
    await fs.unlink(filePath);
    console.log(`Successfully deleted local file: ${filePath}`);
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      console.error(`Failed to delete local file ${url}:`, err);
    }
  }
}

// Read JSON database file
async function readJsonDB() {
  try {
    const data = await fs.readFile(JSON_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    const initialData = {
      heroSettings: fallbackHero,
      curriculumFeatures: fallbackFeatures,
      bentoGallery: fallbackGallery,
      mentors: fallbackMentors,
      pricingPlans: fallbackPricing,
      faqs: fallbackFAQs,
      testimonials: fallbackTestimonials,
      globalSettings: fallbackGlobalSettings,
      aboutSettings: fallbackAboutSettings,
      programs: fallbackPrograms,
      applications: [],
      transactions: []
    };
    await writeJsonDB(initialData);
    return initialData;
  }
}

// Write JSON database file
async function writeJsonDB(data: any) {
  try {
    await fs.mkdir(join(process.cwd(), 'prisma'), { recursive: true });
    await fs.writeFile(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write JSON DB:', err);
  }
}

// 1. HERO SETTINGS
export async function getHeroSettings() {
  try {
    const settings = await prisma.heroSettings.findUnique({ where: { id: 'hero-settings' } });
    if (settings) {
      return {
        ...settings,
        mediaScale: settings.mediaScale ?? 1.0,
        mediaOverlay: settings.mediaOverlay ?? 0.4,
      };
    }
    throw new Error('Not found in DB');
  } catch (error) {
    console.log('Falling back to local database settings for Hero');
    const db = await readJsonDB();
    const s = db.heroSettings || {};
    return {
      title: s.title || '',
      description: s.description || '',
      videoUrl: s.videoUrl || '',
      imageUrl: s.imageUrl || '',
      mediaType: s.mediaType || 'VIDEO',
      mediaPosition: s.mediaPosition || '50%',
      mediaPositionX: s.mediaPositionX || '50%',
      mediaPositionY: s.mediaPositionY || '50%',
      mediaScale: typeof s.mediaScale === 'number' ? s.mediaScale : 1.0,
      mediaOverlay: typeof s.mediaOverlay === 'number' ? s.mediaOverlay : 0.4,
    };
  }
}

export async function updateHeroSettings(data: { 
  title: string; 
  description: string; 
  videoUrl: string; 
  imageUrl?: string;
  mediaType?: string;
  mediaPosition?: string; 
  mediaPositionX?: string; 
  mediaPositionY?: string; 
  mediaScale?: number;
  mediaOverlay?: number;
}) {
  let oldVideoUrl: string | null = null;
  let oldImageUrl: string | null = null;
  try {
    const settings = await prisma.heroSettings.findUnique({ where: { id: 'hero-settings' } });
    if (settings) {
      if (data.videoUrl && settings.videoUrl !== data.videoUrl) {
        oldVideoUrl = settings.videoUrl;
      }
      if (data.imageUrl && (settings as any).imageUrl && (settings as any).imageUrl !== data.imageUrl) {
        oldImageUrl = (settings as any).imageUrl;
      }
    }
    const updated = await prisma.heroSettings.upsert({
      where: { id: 'hero-settings' },
      update: data,
      create: { id: 'hero-settings', ...data }
    });
    if (oldVideoUrl) await deleteFileIfLocal(oldVideoUrl);
    if (oldImageUrl) await deleteFileIfLocal(oldImageUrl);
    return updated;
  } catch (error) {
    console.log('Prisma fail, writing Hero Settings to local JSON database');
    const db = await readJsonDB();
    const settings = db.heroSettings;
    if (settings) {
      if (data.videoUrl && settings.videoUrl !== data.videoUrl) {
        oldVideoUrl = settings.videoUrl;
      }
      if (data.imageUrl && settings.imageUrl && settings.imageUrl !== data.imageUrl) {
        oldImageUrl = settings.imageUrl;
      }
    }
    db.heroSettings = { ...db.heroSettings, ...data };
    await writeJsonDB(db);
    if (oldVideoUrl) await deleteFileIfLocal(oldVideoUrl);
    if (oldImageUrl) await deleteFileIfLocal(oldImageUrl);
    return db.heroSettings;
  }
}

// 2. CURRICULUM FEATURES
export async function getCurriculumFeatures() {
  try {
    const features = await prisma.curriculumFeature.findMany({ orderBy: { order: 'asc' } });
    if (features.length > 0) return features;
    throw new Error('Not found in DB');
  } catch (error) {
    console.log('Falling back to local database settings for Curriculum Features');
    const db = await readJsonDB();
    const sorted = [...(db.curriculumFeatures || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    return sorted;
  }
}

export async function updateCurriculumFeature(id: string, data: { title: string; videoUrl: string; order?: number }) {
  let oldVideoUrl: string | null = null;
  try {
    const feat = await prisma.curriculumFeature.findUnique({ where: { id } });
    if (feat && data.videoUrl && feat.videoUrl !== data.videoUrl) oldVideoUrl = feat.videoUrl;
    const updated = await prisma.curriculumFeature.update({
      where: { id },
      data
    });
    if (oldVideoUrl) await deleteFileIfLocal(oldVideoUrl);
    return updated;
  } catch (error) {
    console.log('Prisma fail, writing Feature to local JSON database');
    const db = await readJsonDB();
    const feat = db.curriculumFeatures.find((x: any) => x.id === id);
    if (feat && data.videoUrl && feat.videoUrl !== data.videoUrl) oldVideoUrl = feat.videoUrl;
    db.curriculumFeatures = db.curriculumFeatures.map((f: any) => 
      f.id === id ? { ...f, ...data } : f
    );
    await writeJsonDB(db);
    if (oldVideoUrl) await deleteFileIfLocal(oldVideoUrl);
    return db.curriculumFeatures.find((f: any) => f.id === id);
  }
}

export async function createCurriculumFeature(data: { title: string; videoUrl: string }) {
  try {
    const count = await prisma.curriculumFeature.count();
    return await prisma.curriculumFeature.create({ data: { ...data, order: count } });
  } catch (error) {
    console.log('Prisma fail, creating Feature in local JSON database');
    const db = await readJsonDB();
    const newFeat = { id: Date.now().toString(), ...data, order: db.curriculumFeatures.length };
    db.curriculumFeatures.push(newFeat);
    await writeJsonDB(db);
    return newFeat;
  }
}

export async function deleteCurriculumFeature(id: string) {
  let oldVideoUrl: string | null = null;
  try {
    const feat = await prisma.curriculumFeature.findUnique({ where: { id } });
    if (feat) oldVideoUrl = feat.videoUrl;
    await prisma.curriculumFeature.delete({ where: { id } });
  } catch (error) {
    console.log('Prisma fail, deleting Feature from local JSON database');
    const db = await readJsonDB();
    const feat = db.curriculumFeatures.find((x: any) => x.id === id);
    if (feat) oldVideoUrl = feat.videoUrl;
    db.curriculumFeatures = db.curriculumFeatures.filter((f: any) => f.id !== id);
    await writeJsonDB(db);
  }
  if (oldVideoUrl) await deleteFileIfLocal(oldVideoUrl);
  return { id };
}

// 3. BENTO GALLERY
export async function getBentoGallery() {
  try {
    const gallery = await prisma.bentoGallery.findMany({ orderBy: { order: 'asc' } });
    if (gallery.length > 0) return gallery;
    throw new Error('Not found in DB');
  } catch (error) {
    console.log('Falling back to local database settings for Bento Gallery');
    const db = await readJsonDB();
    const sorted = [...(db.bentoGallery || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    return sorted;
  }
}

export async function updateBentoGallery(id: string, data: { type: string; url: string; size: string; altText?: string; category?: string; order?: number }) {
  let oldUrl: string | null = null;
  try {
    const g = await prisma.bentoGallery.findUnique({ where: { id } });
    if (g && data.url && g.url !== data.url) oldUrl = g.url;
    const updated = await prisma.bentoGallery.update({
      where: { id },
      data
    });
    if (oldUrl) await deleteFileIfLocal(oldUrl);
    return updated;
  } catch (error) {
    console.log('Prisma fail, writing Bento to local JSON database');
    const db = await readJsonDB();
    const g = db.bentoGallery.find((x: any) => x.id === id);
    if (g && data.url && g.url !== data.url) oldUrl = g.url;
    db.bentoGallery = db.bentoGallery.map((g: any) => 
      g.id === id ? { ...g, ...data } : g
    );
    await writeJsonDB(db);
    if (oldUrl) await deleteFileIfLocal(oldUrl);
    return db.bentoGallery.find((g: any) => g.id === id);
  }
}

export async function createBentoGallery(data: { type: string; url: string; size: string; altText?: string; category?: string }) {
  try {
    const count = await prisma.bentoGallery.count();
    return await prisma.bentoGallery.create({ data: { ...data, order: count } });
  } catch (error) {
    console.log('Prisma fail, creating Bento item in local JSON database');
    const db = await readJsonDB();
    const newItem = { id: Date.now().toString(), ...data, order: db.bentoGallery.length };
    db.bentoGallery.push(newItem);
    await writeJsonDB(db);
    return newItem;
  }
}

export async function deleteBentoGallery(id: string) {
  let oldUrl: string | null = null;
  try {
    const g = await prisma.bentoGallery.findUnique({ where: { id } });
    if (g) oldUrl = g.url;
    await prisma.bentoGallery.delete({ where: { id } });
  } catch (error) {
    console.log('Prisma fail, deleting Bento item from local JSON database');
    const db = await readJsonDB();
    const g = db.bentoGallery.find((x: any) => x.id === id);
    if (g) oldUrl = g.url;
    db.bentoGallery = db.bentoGallery.filter((g: any) => g.id !== id);
    await writeJsonDB(db);
  }
  if (oldUrl) await deleteFileIfLocal(oldUrl);
  return { id };
}

// 4. MENTORS
export async function getMentors() {
  try {
    const mentors = await prisma.mentor.findMany({ orderBy: { order: 'asc' } });
    if (mentors.length > 0) return mentors;
    throw new Error('Not found in DB');
  } catch (error) {
    console.log('Falling back to local database settings for Mentors');
    const db = await readJsonDB();
    const sorted = [...(db.mentors || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    return sorted;
  }
}

export async function createMentor(data: { name: string; role: string; image: string; bio: string; video?: string; socials?: any; subjectTaught?: string; experienceCredits?: string; hidden?: boolean }) {
  try {
    return await prisma.mentor.create({ data: data as any });
  } catch (error) {
    console.log('Prisma fail, writing new Mentor to local JSON database');
    const db = await readJsonDB();
    const newMentor = { 
      id: Date.now().toString(), 
      subjectTaught: data.subjectTaught || '',
      experienceCredits: data.experienceCredits || '',
      hidden: data.hidden || false,
      video: data.video || '',
      socials: data.socials || {},
      ...data, 
      order: db.mentors.length 
    };
    db.mentors.push(newMentor);
    await writeJsonDB(db);
    return newMentor;
  }
}

export async function updateMentor(id: string, data: { name?: string; role?: string; image?: string; bio?: string; video?: string; socials?: any; order?: number; subjectTaught?: string; experienceCredits?: string; hidden?: boolean }) {
  let oldImage: string | null = null;
  let oldVideo: string | null = null;
  try {
    const m = await prisma.mentor.findUnique({ where: { id } });
    if (m) {
      if (data.image && m.image !== data.image) oldImage = m.image;
      if (data.video && m.video !== data.video) oldVideo = m.video;
    }
    const updated = await prisma.mentor.update({
      where: { id },
      data: data as any
    });
    if (oldImage) await deleteFileIfLocal(oldImage);
    if (oldVideo) await deleteFileIfLocal(oldVideo);
    return updated;
  } catch (error) {
    console.log('Prisma fail, updating Mentor in local JSON database');
    const db = await readJsonDB();
    const m = db.mentors.find((x: any) => x.id === id);
    if (m) {
      if (data.image && m.image !== data.image) oldImage = m.image;
      if (data.video && m.video !== data.video) oldVideo = m.video;
    }
    db.mentors = db.mentors.map((m: any) => 
      m.id === id ? { ...m, ...data } : m
    );
    await writeJsonDB(db);
    if (oldImage) await deleteFileIfLocal(oldImage);
    if (oldVideo) await deleteFileIfLocal(oldVideo);
    return db.mentors.find((m: any) => m.id === id);
  }
}

export async function deleteMentor(id: string) {
  let oldImage: string | null = null;
  let oldVideo: string | null = null;
  try {
    const m = await prisma.mentor.findUnique({ where: { id } });
    if (m) {
      oldImage = m.image;
      oldVideo = m.video;
    }
    await prisma.mentor.delete({ where: { id } });
  } catch (error) {
    console.log('Prisma fail, deleting Mentor from local JSON database');
    const db = await readJsonDB();
    const m = db.mentors.find((x: any) => x.id === id);
    if (m) {
      oldImage = m.image;
      oldVideo = m.video;
    }
    db.mentors = db.mentors.filter((m: any) => m.id !== id);
    await writeJsonDB(db);
  }
  if (oldImage) await deleteFileIfLocal(oldImage);
  if (oldVideo) await deleteFileIfLocal(oldVideo);
  return { id };
}

// 5. PRICING PLANS
export async function getPricingPlans() {
  try {
    const pricing = await prisma.pricingPlan.findMany({ orderBy: { order: 'asc' } });
    if (pricing.length > 0) return pricing;
    throw new Error('Not found in DB');
  } catch (error) {
    console.log('Falling back to local database settings for Pricing Plans');
    const db = await readJsonDB();
    const sorted = [...(db.pricingPlans || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    return sorted;
  }
}

export async function updatePricingPlan(id: string, data: { name: string; description: string; price: string; period: string; features: string[]; isFeatured: boolean; badge: string; order?: number }) {
  try {
    return await prisma.pricingPlan.update({
      where: { id },
      data
    });
  } catch (error) {
    console.log('Prisma fail, updating Pricing Plan in local JSON database');
    const db = await readJsonDB();
    db.pricingPlans = db.pricingPlans.map((p: any) => 
      p.id === id ? { ...p, ...data } : p
    );
    await writeJsonDB(db);
    return db.pricingPlans.find((p: any) => p.id === id);
  }
}

export async function createPricingPlan(data: { name: string; description: string; price: string; period: string; features: string[]; isFeatured: boolean; badge: string }) {
  try {
    return await prisma.pricingPlan.create({ data });
  } catch (error) {
    console.log('Prisma fail, creating Pricing Plan in local JSON database');
    const db = await readJsonDB();
    const newPlan = { id: Date.now().toString(), ...data, order: db.pricingPlans.length };
    db.pricingPlans.push(newPlan);
    await writeJsonDB(db);
    return newPlan;
  }
}

export async function deletePricingPlan(id: string) {
  try {
    return await prisma.pricingPlan.delete({ where: { id } });
  } catch (error) {
    console.log('Prisma fail, deleting Pricing Plan from local JSON database');
    const db = await readJsonDB();
    db.pricingPlans = db.pricingPlans.filter((p: any) => p.id !== id);
    await writeJsonDB(db);
    return { id };
  }
}


// 6. FAQs
export async function getFAQs() {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { order: 'asc' } });
    if (faqs.length > 0) return faqs;
    throw new Error('Not found in DB');
  } catch (error) {
    console.log('Falling back to local database settings for FAQs');
    const db = await readJsonDB();
    return db.faqs;
  }
}

export async function createFAQ(data: { question: string; answer: string }) {
  try {
    return await prisma.fAQ.create({ data });
  } catch (error) {
    console.log('Prisma fail, creating FAQ in local JSON database');
    const db = await readJsonDB();
    const newFaq = { id: Date.now().toString(), ...data };
    db.faqs.push(newFaq);
    await writeJsonDB(db);
    return newFaq;
  }
}

export async function updateFAQ(id: string, data: { question: string; answer: string }) {
  try {
    return await prisma.fAQ.update({
      where: { id },
      data
    });
  } catch (error) {
    console.log('Prisma fail, updating FAQ in local JSON database');
    const db = await readJsonDB();
    db.faqs = db.faqs.map((f: any) => 
      f.id === id ? { ...f, ...data } : f
    );
    await writeJsonDB(db);
    return db.faqs.find((f: any) => f.id === id);
  }
}

export async function deleteFAQ(id: string) {
  try {
    return await prisma.fAQ.delete({ where: { id } });
  } catch (error) {
    console.log('Prisma fail, deleting FAQ from local JSON database');
    const db = await readJsonDB();
    db.faqs = db.faqs.filter((f: any) => f.id !== id);
    await writeJsonDB(db);
    return { id };
  }
}

// 7. TESTIMONIALS
export async function getTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
    if (testimonials.length > 0) return testimonials;
    throw new Error('Not found in DB');
  } catch (error) {
    console.log('Falling back to local database settings for Testimonials');
    const db = await readJsonDB();
    return db.testimonials;
  }
}

export async function createTestimonial(data: { quote: string; author: string; role: string }) {
  try {
    const count = await prisma.testimonial.count();
    return await prisma.testimonial.create({ data: { ...data, order: count } });
  } catch (error) {
    console.log('Prisma fail, creating Testimonial in local JSON database');
    const db = await readJsonDB();
    const newT = { id: Date.now().toString(), ...data, order: db.testimonials.length };
    db.testimonials.push(newT);
    await writeJsonDB(db);
    return newT;
  }
}

export async function updateTestimonial(id: string, data: { quote: string; author: string; role: string }) {
  try {
    return await prisma.testimonial.update({ where: { id }, data });
  } catch (error) {
    console.log('Prisma fail, updating Testimonial in local JSON database');
    const db = await readJsonDB();
    db.testimonials = db.testimonials.map((t: any) => t.id === id ? { ...t, ...data } : t);
    await writeJsonDB(db);
    return db.testimonials.find((t: any) => t.id === id);
  }
}

export async function deleteTestimonial(id: string) {
  try {
    return await prisma.testimonial.delete({ where: { id } });
  } catch (error) {
    console.log('Prisma fail, deleting Testimonial from local JSON database');
    const db = await readJsonDB();
    db.testimonials = db.testimonials.filter((t: any) => t.id !== id);
    await writeJsonDB(db);
    return { id };
  }
}

// 8. APPLICATIONS
export async function getApplications() {
  try {
    return await prisma.application.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.log('Falling back to local database settings for Applications');
    const db = await readJsonDB();
    return db.applications;
  }
}

export async function createApplication(data: any) {
  try {
    return await prisma.application.create({ data });
  } catch (error) {
    console.log('Prisma fail, creating Application in local JSON database');
    const db = await readJsonDB();
    const newApp = { 
      id: Date.now().toString(), 
      createdAt: new Date().toISOString(), 
      status: 'PENDING',
      ...data 
    };
    db.applications.push(newApp);
    await writeJsonDB(db);
    return newApp;
  }
}

export async function updateApplicationStatus(id: string, status: string) {
  const generatedPassword = `Marse2026!${id ? id.slice(-3) : '789'}`;
  try {
    const existing = await prisma.application.findUnique({ where: { id } });
    const updateData: any = { status };
    if (status === 'APPROVED' && (!existing || !(existing as any).password)) {
      updateData.password = generatedPassword;
    }
    return await prisma.application.update({
      where: { id },
      data: updateData
    });
  } catch (error) {
    console.log('Prisma fail, updating Application Status in local JSON database');
    const db = await readJsonDB();
    db.applications = db.applications.map((a: any) => {
      if (a.id === id) {
        const passwordToSet = a.password || (status === 'APPROVED' ? generatedPassword : undefined);
        return { ...a, status, password: passwordToSet };
      }
      return a;
    });
    await writeJsonDB(db);
    return db.applications.find((a: any) => a.id === id);
  }
}

export async function updateApplicationPassword(id: string, newPassword: string) {
  try {
    return await prisma.application.update({
      where: { id },
      data: { password: newPassword } as any
    });
  } catch (error) {
    console.log('Prisma fail, updating password in local JSON database');
    const db = await readJsonDB();
    db.applications = db.applications.map((a: any) => 
      a.id === id ? { ...a, password: newPassword } : a
    );
    await writeJsonDB(db);
    return db.applications.find((a: any) => a.id === id);
  }
}

export async function updateApplicationCohort(id: string, cohortId: string | null) {
  try {
    return await prisma.application.update({
      where: { id },
      data: { cohortId }
    });
  } catch (error) {
    console.log('Prisma fail, updating Application Cohort in local JSON database');
    const db = await readJsonDB();
    db.applications = db.applications.map((a: any) => 
      a.id === id ? { ...a, cohortId } : a
    );
    await writeJsonDB(db);
    return db.applications.find((a: any) => a.id === id);
  }
}

// 9. TRANSACTIONS
export async function getTransactions() {
  try {
    return await prisma.transaction.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.log('Falling back to local database settings for Transactions');
    const db = await readJsonDB();
    return db.transactions;
  }
}

export async function createTransaction(data: any) {
  try {
    return await prisma.transaction.create({ data });
  } catch (error) {
    console.log('Prisma fail, creating Transaction in local JSON database');
    const db = await readJsonDB();
    const newTx = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...data, status: 'COMPLETED' };
    db.transactions.push(newTx);
    await writeJsonDB(db);
    return newTx;
  }
}

// 10. COHORTS
export async function getCohorts() {
  const db = await readJsonDB();
  return db.cohorts || [];
}

export async function createCohort(data: any) {
  const db = await readJsonDB();
  if (!db.cohorts) db.cohorts = [];
  const newCohort = { id: Date.now().toString(), createdAt: new Date().toISOString(), status: 'Active', ...data };
  db.cohorts.push(newCohort);
  await writeJsonDB(db);
  return newCohort;
}

export async function deleteCohort(id: string) {
  const db = await readJsonDB();
  if (!db.cohorts) db.cohorts = [];
  db.cohorts = db.cohorts.filter((c: any) => c.id !== id);
  await writeJsonDB(db);
  return { id };
}

// 11. ATTENDANCE
export async function getAttendanceLogs() {
  const db = await readJsonDB();
  return db.attendanceLogs || [];
}

export async function saveAttendanceLog(data: any) {
  const db = await readJsonDB();
  if (!db.attendanceLogs) db.attendanceLogs = [];
  const index = db.attendanceLogs.findIndex((log: any) => log.cohortId === data.cohortId && log.date === data.date);
  const record = { id: Date.now().toString(), updatedAt: new Date().toISOString(), ...data };
  if (index >= 0) {
    db.attendanceLogs[index] = { ...db.attendanceLogs[index], ...record };
  } else {
    db.attendanceLogs.push(record);
  }
  await writeJsonDB(db);
  return record;
}

// 12. STAFF
export async function getStaffList() {
  const db = await readJsonDB();
  return db.staffList || [];
}

export async function createStaffMember(data: any) {
  const db = await readJsonDB();
  if (!db.staffList) db.staffList = [];
  const newStaff = { id: Date.now().toString(), ...data };
  db.staffList.push(newStaff);
  await writeJsonDB(db);
  return newStaff;
}

export async function deleteStaffMember(id: string) {
  const db = await readJsonDB();
  if (!db.staffList) db.staffList = [];
  db.staffList = db.staffList.filter((s: any) => s.id !== id);
  await writeJsonDB(db);
  return { id };
}

// 13. WHATSAPP SETTINGS & LOGS
export async function getWhatsAppSettings() {
  const db = await readJsonDB();
  return db.whatsappSettings || {
    twilioSid: '',
    twilioToken: '',
    twilioNumber: '',
    autoOnAbsence: true,
    autoOnApproval: true
  };
}

export async function saveWhatsAppSettings(data: any) {
  const db = await readJsonDB();
  db.whatsappSettings = { ...(db.whatsappSettings || {}), ...data };
  await writeJsonDB(db);
  return db.whatsappSettings;
}

export async function getWhatsAppLogs() {
  const db = await readJsonDB();
  return db.whatsappLogs || [];
}

export async function createWhatsAppLog(data: any) {
  const db = await readJsonDB();
  if (!db.whatsappLogs) db.whatsappLogs = [];
  const log = { id: Date.now().toString(), timestamp: new Date().toISOString(), ...data };
  db.whatsappLogs.unshift(log); // newest first
  if (db.whatsappLogs.length > 100) db.whatsappLogs.pop(); // Cap at 100
  await writeJsonDB(db);
  return log;
}

export async function sendTwilioWhatsApp(to: string, message: string) {
  const settings = await getWhatsAppSettings();
  const { twilioSid, twilioToken, twilioNumber } = settings;

  if (!to) return { success: false, error: 'Recipient phone number is required' };

  // Normalise phone number to WhatsApp format (e.g. whatsapp:+447700900077)
  const cleanTo = to.trim().replace(/\s+/g, '');
  const formattedTo = cleanTo.startsWith('+') ? `whatsapp:${cleanTo}` : `whatsapp:+${cleanTo}`;
  
  if (!twilioSid || !twilioToken || !twilioNumber) {
    console.log(`[SIMULATION] WhatsApp message to ${to}: "${message}"`);
    await createWhatsAppLog({
      recipient: to,
      message,
      status: 'SIMULATED'
    });
    return { success: true, simulated: true };
  }

  const cleanFrom = twilioNumber.trim().replace(/\s+/g, '');
  const formattedFrom = cleanFrom.startsWith('+') ? `whatsapp:${cleanFrom}` : `whatsapp:+${cleanFrom}`;

  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        To: formattedTo,
        From: formattedFrom,
        Body: message
      })
    });

    const resData = await response.json();
    if (response.ok) {
      await createWhatsAppLog({
        recipient: to,
        message,
        status: 'SENT'
      });
      return { success: true, data: resData };
    } else {
      await createWhatsAppLog({
        recipient: to,
        message,
        status: 'FAILED',
        error: resData.message || 'Unknown Twilio error'
      });
      return { success: false, error: resData.message };
    }
  } catch (err: any) {
    console.error('Failed to send Twilio WhatsApp:', err);
    await createWhatsAppLog({
      recipient: to,
      message,
      status: 'FAILED',
      error: err.message
    });
    return { success: false, error: err.message };
  }
}

// 14. STUDENT ASSESSMENT & PORTFOLIO BUILDER
export async function updateStudentPortfolioAndGrading(id: string, data: { rating?: number; notes?: string; photos?: string[] }) {
  try {
    const db = await readJsonDB();
    db.applications = db.applications.map((a: any) => {
      if (a.id === id) {
        return {
          ...a,
          evaluationRating: data.rating !== undefined ? data.rating : a.evaluationRating,
          evaluationNotes: data.notes !== undefined ? data.notes : a.evaluationNotes,
          portfolioPhotos: data.photos !== undefined ? data.photos : (a.portfolioPhotos || [])
        };
      }
      return a;
    });
    await writeJsonDB(db);
    return db.applications.find((a: any) => a.id === id);
  } catch (error) {
    console.error('Failed to update student portfolio & grading:', error);
    throw error;
  }
}

// 15. CORE SUBJECTS CMS
export async function getCoreSubjects() {
  const db = await readJsonDB();
  const list = db.coreSubjects || fallbackSubjects;
  return [...list].sort((a: any, b: any) => (a.order !== undefined ? a.order : 0) - (b.order !== undefined ? b.order : 0));
}

export async function createCoreSubject(data: { title: string; icon: string; desc: string }) {
  const db = await readJsonDB();
  const currentList = db.coreSubjects || [...fallbackSubjects];
  const newSubject = {
    id: 'subject-' + Date.now(),
    title: data.title,
    icon: data.icon || 'star',
    desc: data.desc,
    order: currentList.length
  };
  currentList.push(newSubject);
  db.coreSubjects = currentList;
  await writeJsonDB(db);
  return newSubject;
}

export async function updateCoreSubject(data: { id: string; title: string; icon: string; desc: string; order?: number }) {
  const db = await readJsonDB();
  const currentList = db.coreSubjects || [...fallbackSubjects];
  db.coreSubjects = currentList.map((s: any) => s.id === data.id ? { ...s, ...data } : s);
  await writeJsonDB(db);
  return data;
}

export async function deleteCoreSubject(id: string) {
  const db = await readJsonDB();
  const currentList = db.coreSubjects || [...fallbackSubjects];
  db.coreSubjects = currentList.filter((s: any) => s.id !== id);
  await writeJsonDB(db);
  return { id };
}

export async function reorderCoreSubjects(orderedIds: string[]) {
  const db = await readJsonDB();
  const currentList = db.coreSubjects || [...fallbackSubjects];
  db.coreSubjects = currentList.map((s: any) => {
    const idx = orderedIds.indexOf(s.id);
    return idx !== -1 ? { ...s, order: idx } : s;
  });
  await writeJsonDB(db);
  return db.coreSubjects;
}

// 16. STUDENT JOURNEY CMS
export async function getJourneySteps() {
  const db = await readJsonDB();
  return (db.journeySteps || fallbackJourneySteps).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
}

export async function updateJourneyStep(data: { id: string; step: string; title: string; desc: string }) {
  const db = await readJsonDB();
  db.journeySteps = (db.journeySteps || fallbackJourneySteps).map((s: any) => s.id === data.id ? { ...s, ...data } : s);
  await writeJsonDB(db);
  return data;
}

// 17. GLOBAL SETTINGS CMS
export async function getGlobalSettings() {
  const db = await readJsonDB();
  if (!db.globalSettings) {
    db.globalSettings = fallbackGlobalSettings;
    await writeJsonDB(db);
  }
  return db.globalSettings;
}

export async function updateGlobalSettings(data: any) {
  const db = await readJsonDB();
  db.globalSettings = { ...db.globalSettings, ...data };
  await writeJsonDB(db);
  return db.globalSettings;
}

// 18. ABOUT SETTINGS CMS
export async function getAboutSettings() {
  const db = await readJsonDB();
  if (!db.aboutSettings) {
    db.aboutSettings = fallbackAboutSettings;
    await writeJsonDB(db);
  }
  return db.aboutSettings;
}

export async function updateAboutSettings(data: any) {
  const db = await readJsonDB();
  db.aboutSettings = { ...(db.aboutSettings || fallbackAboutSettings), ...data };
  await writeJsonDB(db);
  return db.aboutSettings;
}

// 19. PROGRAMS CMS
export async function getPrograms() {
  const db = await readJsonDB();
  if (!db.programs) {
    db.programs = fallbackPrograms;
    await writeJsonDB(db);
  }
  const sorted = [...db.programs].sort((a, b) => (a.order || 0) - (b.order || 0));
  return sorted;
}

export async function updateProgram(id: string, data: { title: string; desc: string; img: string; order?: number }) {
  let oldImgUrl: string | null = null;
  const db = await readJsonDB();
  const prog = db.programs.find((x: any) => x.id === id);
  if (prog && data.img && prog.img !== data.img) oldImgUrl = prog.img;
  db.programs = db.programs.map((p: any) => 
    p.id === id ? { ...p, ...data } : p
  );
  await writeJsonDB(db);
  if (oldImgUrl) await deleteFileIfLocal(oldImgUrl);
  return db.programs.find((p: any) => p.id === id);
}

export async function createProgram(data: { title: string; desc: string; img: string }) {
  const db = await readJsonDB();
  if (!db.programs) db.programs = [...fallbackPrograms];
  const newItem = { id: Date.now().toString(), ...data, order: db.programs.length };
  db.programs.push(newItem);
  await writeJsonDB(db);
  return newItem;
}

export async function deleteProgram(id: string) {
  let oldImgUrl: string | null = null;
  const db = await readJsonDB();
  const prog = db.programs.find((x: any) => x.id === id);
  if (prog) oldImgUrl = prog.img;
  db.programs = db.programs.filter((p: any) => p.id !== id);
  await writeJsonDB(db);
  if (oldImgUrl) await deleteFileIfLocal(oldImgUrl);
  return { id };
}

// 20. ELCAPTAIN BATCH REORDER FUNCTIONS
export async function reorderBentoGallery(orderedIds: string[]) {
  const db = await readJsonDB();
  db.bentoGallery = (db.bentoGallery || []).map((item: any) => {
    const idx = orderedIds.indexOf(item.id);
    return idx !== -1 ? { ...item, order: idx } : item;
  }).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  await writeJsonDB(db);
  return db.bentoGallery;
}

export async function reorderMentors(orderedIds: string[]) {
  const db = await readJsonDB();
  db.mentors = (db.mentors || []).map((item: any) => {
    const idx = orderedIds.indexOf(item.id);
    return idx !== -1 ? { ...item, order: idx } : item;
  }).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  await writeJsonDB(db);
  return db.mentors;
}

export async function reorderPricingPlans(orderedIds: string[]) {
  const db = await readJsonDB();
  db.pricingPlans = (db.pricingPlans || []).map((item: any) => {
    const idx = orderedIds.indexOf(item.id);
    return idx !== -1 ? { ...item, order: idx } : item;
  }).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  await writeJsonDB(db);
  return db.pricingPlans;
}

export async function reorderJourneySteps(orderedIds: string[]) {
  const db = await readJsonDB();
  db.journeySteps = (db.journeySteps || []).map((item: any) => {
    const idx = orderedIds.indexOf(item.id);
    return idx !== -1 ? { ...item, order: idx } : item;
  }).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  await writeJsonDB(db);
  return db.journeySteps;
}

export async function reorderPrograms(orderedIds: string[]) {
  const db = await readJsonDB();
  db.programs = (db.programs || []).map((item: any) => {
    const idx = orderedIds.indexOf(item.id);
    return idx !== -1 ? { ...item, order: idx } : item;
  }).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  await writeJsonDB(db);
  return db.programs;
}
