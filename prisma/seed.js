const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Hero Settings
  await prisma.heroSettings.upsert({
    where: { id: 'hero-settings' },
    update: {},
    create: {
      id: 'hero-settings',
      title: 'BEYOND EDUCATION.\nBEYOND LIMITS.',
      description: 'An exclusive collective designed for ambitious youth who dare to shape the future. The Marse Talent standard.',
      videoUrl: '/vienna-makeup-hair.mp4',
    },
  });

  // 2. Curriculum Features
  await prisma.curriculumFeature.deleteMany({});
  await prisma.curriculumFeature.createMany({
    data: [
      {
        title: 'Immersive Global Curriculum',
        videoUrl: '/london-workshop.mp4',
        order: 1,
      },
      {
        title: 'Elite Professional Mentors',
        videoUrl: '/vienna-workshop.mp4',
        order: 2,
      },
      {
        title: 'Future-ready Technology',
        videoUrl: '/studio-guide.mp4',
        order: 3,
      },
    ],
  });

  // 3. Bento Gallery
  await prisma.bentoGallery.deleteMany({});
  await prisma.bentoGallery.createMany({
    data: [
      {
        type: 'VIDEO',
        url: '/london-workshop.mp4',
        size: 'WIDE',
        altText: 'London Workshop',
        order: 1,
      },
      {
        type: 'IMAGE',
        url: '/gallery-1.jpg',
        size: 'WIDE',
        altText: 'Campus Life',
        order: 2,
      },
      {
        type: 'IMAGE',
        url: '/gallery-2.jpg',
        size: 'SQUARE',
        altText: 'Students',
        order: 3,
      },
      {
        type: 'IMAGE',
        url: '/gallery-3.jpg',
        size: 'SQUARE',
        altText: 'Events',
        order: 4,
      },
      {
        type: 'VIDEO',
        url: '/vienna-workshop.mp4',
        size: 'TALL',
        altText: 'Vienna Workshop',
        order: 5,
      },
      {
        type: 'IMAGE',
        url: '/gallery-4.jpg',
        size: 'SQUARE',
        altText: 'Excellence',
        order: 6,
      },
      {
        type: 'IMAGE',
        url: '/gallery-5.jpg',
        size: 'WIDE',
        altText: 'Networking',
        order: 7,
      },
    ],
  });

  // 4. Mentors
  await prisma.mentor.deleteMany({});
  await prisma.mentor.createMany({
    data: [
      {
        name: 'Dr. Evelyn Hayes',
        role: 'Dean of Global Leadership',
        image: '/team-1.jpg',
        bio: 'Dr. Evelyn Hayes has spent over 20 years leading global initiatives at the intersection of business strategy and creative direction. Formerly an editor at major style publications, she teaches the core leadership mindset.',
        video: '/london-workshop.mp4',
        socials: { instagram: '#', linkedin: '#', behance: '#' },
        order: 1,
      },
      {
        name: 'Julian Vance',
        role: 'Head of Innovation & Tech',
        image: '/team-2.jpg',
        bio: 'Julian is a digital pioneer and tech consultant who has built multiple creative studios across Europe. He focuses on integrating AI and cutting-edge visual tools into modern creative workflows.',
        video: '/vienna-workshop.mp4',
        socials: { instagram: '#', linkedin: '#', behance: '#' },
        order: 2,
      },
      {
        name: 'Sarah Chen',
        role: 'Director of Applied Arts',
        image: '/team-3.jpg',
        bio: 'Sarah is an award-winning creative director specializing in editorial photography and modeling coaching. She conducts global workshops focusing on visual storytelling and brand building.',
        video: '/london-workshop.mp4',
        socials: { instagram: '#', linkedin: '#', behance: '#' },
        order: 3,
      },
      {
        name: 'Marcus Sterling',
        role: 'Senior Economics Fellow',
        image: '/team-4.jpg',
        bio: 'Marcus brings a wealth of knowledge in luxury market economics. A fellow at elite institutions, he helps students understand value creation, pricing power, and business growth in premium sectors.',
        video: '/vienna-workshop.mp4',
        socials: { instagram: '#', linkedin: '#', behance: '#' },
        order: 4,
      },
      {
        name: 'Dr. Alistair Reed',
        role: 'Strategic Relations Mentor',
        image: '/team-5.jpg',
        bio: 'Dr. Reed is a strategic consultant who facilitates high-level industry connections. He coaches students on pitching, elite networking, and relationship building in the luxury market.',
        video: '/london-workshop.mp4',
        socials: { instagram: '#', linkedin: '#', behance: '#' },
        order: 5,
      },
    ],
  });

  // 5. Pricing Plans
  await prisma.pricingPlan.deleteMany({});
  await prisma.pricingPlan.createMany({
    data: [
      {
        name: 'Monthly',
        description: 'Flexible membership for ongoing access.',
        price: '$4,500',
        period: '/mo',
        features: ['Standard Curriculum Access', 'Digital Library Entry', 'Monthly Progress Reviews'],
        isFeatured: false,
        order: 1,
      },
      {
        name: 'Full Annual',
        description: 'The complete Marse Talent experience with exclusive privileges.',
        price: '$48,000',
        period: '/yr',
        features: ['Elite Access Benefits Included', 'Priority Course Registration', 'Dedicated Academic Advisor', 'Global Alumni Network Entry'],
        isFeatured: true,
        order: 2,
      },
      {
        name: 'Quarterly',
        description: 'Structured installments aligned with academic terms.',
        price: '$12,500',
        period: '/quarter',
        features: ['Standard Curriculum Access', 'Term-based Advisory Sessions', 'Campus Facilities Access'],
        isFeatured: false,
        order: 3,
      },
    ],
  });

  // 6. FAQs
  await prisma.fAQ.deleteMany({});
  await prisma.fAQ.createMany({
    data: [
      {
        question: 'What are the admission requirements for Marse Talent Academy?',
        answer: 'Admissions are highly selective. Applicants must submit their academic portfolio, undergo a personal interview, and demonstrate a strong commitment to global leadership, luxury photography, or modeling. We review every application holistically.',
        order: 1,
      },
      {
        question: 'How do the payment plans work?',
        answer: 'We offer three tuition payment schedules: Monthly installments ($4,500/mo), Quarterly payments ($12,500/quarter), and Full Annual enrollment ($48,000/year). Annual enrollment includes complete priority access to all workshops, international events, and dedicated mentorship.',
        order: 2,
      },
      {
        question: 'Where are the international workshops located?',
        answer: 'Marse Talent Academy conducts physical workshops in key global hubs, primarily Vienna (Austria) and London (United Kingdom). Annual members receive a Global Campus Pass granting unrestricted entry to all workshop facilities.',
        order: 3,
      },
      {
        question: 'Is the curriculum suitable for beginner students?',
        answer: 'Yes, our curriculum spans from advanced fundamentals to elite mastery. Mentors tailor projects and case studies based on each student\'s current expertise to ensure an accelerated professional growth path.',
        order: 4,
      },
      {
        question: 'Can guardians monitor the academic progress of the student?',
        answer: 'Absolutely. We provide term-based progress reviews, academic advisory sessions, and direct parent-mentor conferences to review student growth and plan future career opportunities.',
        order: 5,
      },
    ],
  });

  // 7. Testimonials
  await prisma.testimonial.deleteMany({});
  await prisma.testimonial.createMany({
    data: [
      {
        quote: "Marse Talent Academy transformed my creative photography. The mentorship with Julia Marse was unmatched. They don't just teach techniques; they define your vision as an artist.",
        author: "Elena Rostova",
        role: "Fine Art Photographer & Alumna",
        order: 1,
      },
      {
        quote: "The networking opportunities alone are worth the investment. Through their London workshops, I secured my first major campaign with an international fashion brand.",
        author: "Maximilian Keller",
        role: "Editorial Model & Graduate",
        order: 2,
      },
      {
        quote: "Investing in my daughter's education at Marse Talent was the best decision. The structured feedback and global campus access gave her a competitive edge in international design.",
        author: "Dr. Albert Weber",
        role: "Parent of Annual Member",
        order: 3,
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
