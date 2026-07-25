const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function run() {
  let prisma = null;
  const referencedUrls = new Set();

  try {
    prisma = new PrismaClient();
    console.log('Initialized PrismaClient.');
  } catch (e) {
    console.log('⚠️ Could not initialize PrismaClient, skipping PostgreSQL checks.');
  }

  console.log('--- SCANNING DATABASE REFERENCES ---');

  // 1. Scan Prisma PostgreSQL Database (if active)
  if (prisma) {
    try {
      const hero = await prisma.heroSettings.findFirst();
      if (hero?.videoUrl) referencedUrls.add(hero.videoUrl);

      const features = await prisma.curriculumFeature.findMany();
      features.forEach(f => {
        if (f.videoUrl) referencedUrls.add(f.videoUrl);
      });

      const bento = await prisma.bentoGallery.findMany();
      bento.forEach(b => {
        if (b.url) referencedUrls.add(b.url);
      });

      const mentors = await prisma.mentor.findMany();
      mentors.forEach(m => {
        if (m.image) referencedUrls.add(m.image);
        if (m.video) referencedUrls.add(m.video);
      });

      const applications = await prisma.application.findMany();
      applications.forEach(a => {
        if (a.photo) referencedUrls.add(a.photo);
      });
      console.log('✅ Successfully read references from PostgreSQL database via Prisma.');
    } catch (err) {
      console.log('⚠️ Prisma/PostgreSQL database not accessible, skipping PostgreSQL check.');
    }
  }

  // 2. Scan fallback local JSON database (db_fallback.json)
  const fallbackDbPath = path.join(__dirname, '..', 'prisma', 'db_fallback.json');
  if (fs.existsSync(fallbackDbPath)) {
    try {
      const dbContent = JSON.parse(fs.readFileSync(fallbackDbPath, 'utf8'));
      
      if (dbContent.heroSettings?.videoUrl) referencedUrls.add(dbContent.heroSettings.videoUrl);
      
      if (Array.isArray(dbContent.curriculumFeatures)) {
        dbContent.curriculumFeatures.forEach(f => {
          if (f.videoUrl) referencedUrls.add(f.videoUrl);
        });
      }

      if (Array.isArray(dbContent.bentoGallery)) {
        dbContent.bentoGallery.forEach(g => {
          if (g.url) referencedUrls.add(g.url);
        });
      }

      if (Array.isArray(dbContent.mentors)) {
        dbContent.mentors.forEach(m => {
          if (m.image) referencedUrls.add(m.image);
          if (m.video) referencedUrls.add(m.video);
        });
      }

      if (Array.isArray(dbContent.applications)) {
        dbContent.applications.forEach(a => {
          if (a.photo) referencedUrls.add(a.photo);
        });
      }
      console.log('✅ Successfully read references from fallback JSON database.');
    } catch (err) {
      console.error('❌ Failed to parse db_fallback.json:', err);
    }
  } else {
    console.log('⚠️ Fallback JSON database file not found.');
  }

  console.log(`\nFound ${referencedUrls.size} unique media references in database:`);
  referencedUrls.forEach(url => console.log(`  - ${url}`));

  // 3. Scan physical files in public/uploads
  console.log('\n--- SCANNING public/uploads DIRECTORY ---');
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  let deletedUploadsCount = 0;
  let savedUploadsCount = 0;

  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    files.forEach(file => {
      // Recreate relative web url
      const relativeUrl = `/uploads/${file}`;
      if (!referencedUrls.has(relativeUrl)) {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted unreferenced upload: ${file}`);
        deletedUploadsCount++;
      } else {
        console.log(`🟢 Saved active upload: ${file}`);
        savedUploadsCount++;
      }
    });
  } else {
    console.log('uploads directory does not exist.');
  }

  // 4. Scan physical files directly in public (e.g. large videos / feature videos)
  console.log('\n--- SCANNING public DIRECTORY ---');
  const publicDir = path.join(__dirname, '..', 'public');
  let deletedPublicCount = 0;
  let savedPublicCount = 0;

  // List of files we should never delete (whitelist)
  const whitelist = new Set([
    'logo.png',
    'favicon.ico',
    'uploads' // Directory itself
  ]);

  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    files.forEach(file => {
      const filePath = path.join(publicDir, file);
      // Skip directories (like uploads) or whitelisted files
      if (fs.statSync(filePath).isDirectory() || whitelist.has(file)) {
        return;
      }

      // Check if it's an image or video
      const ext = path.extname(file).toLowerCase();
      if (!['.mp4', '.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext)) {
        return;
      }

      const relativeUrl = `/${file}`;
      if (!referencedUrls.has(relativeUrl)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted unreferenced asset in public/: ${file}`);
        deletedPublicCount++;
      } else {
        console.log(`🟢 Saved active asset in public/: ${file}`);
        savedPublicCount++;
      }
    });
  }

  console.log('\n--- CLEANUP SUMMARY ---');
  console.log(`Uploads cleaned: ${deletedUploadsCount} deleted, ${savedUploadsCount} active saved.`);
  console.log(`Public assets cleaned: ${deletedPublicCount} deleted, ${savedPublicCount} active saved.`);
  
  if (prisma) {
    try {
      await prisma.$disconnect();
    } catch(e){}
  }
}

run().catch(console.error);
