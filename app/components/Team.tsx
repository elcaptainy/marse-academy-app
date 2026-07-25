'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import styles from './Team.module.css';

export default function Team({ initialData }: { initialData?: any[] }) {
  const [teamMembers, setTeamMembers] = useState<any[]>(initialData || [
    {
      id: '1',
      name: 'Dr. Evelyn Hayes',
      role: 'Dean of Global Leadership',
      image: '/team-1.jpg',
      bio: 'Dr. Evelyn Hayes has spent over 20 years leading global initiatives at the intersection of business strategy and creative direction. Formerly an editor at major style publications, she teaches the core leadership mindset.',
      video: '/london-workshop.mp4',
      socials: { instagram: '#', linkedin: '#', behance: '#' }
    },
    {
      id: '2',
      name: 'Julian Vance',
      role: 'Head of Innovation & Tech',
      image: '/team-2.jpg',
      bio: 'Julian is a digital pioneer and tech consultant who has built multiple creative studios across Europe. He focuses on integrating AI and cutting-edge visual tools into modern creative workflows.',
      video: '/vienna-workshop.mp4',
      socials: { instagram: '#', linkedin: '#', behance: '#' }
    },
    {
      id: '3',
      name: 'Sarah Chen',
      role: 'Director of Applied Arts',
      image: '/team-3.jpg',
      bio: 'Sarah is an award-winning creative director specializing in editorial photography and modeling coaching. She conducts global workshops focusing on visual storytelling and brand building.',
      video: '/london-workshop.mp4',
      socials: { instagram: '#', linkedin: '#', behance: '#' }
    },
    {
      id: '4',
      name: 'Marcus Sterling',
      role: 'Senior Economics Fellow',
      image: '/team-4.jpg',
      bio: 'Marcus brings a wealth of knowledge in luxury market economics. A fellow at elite institutions, he helps students understand value creation, pricing power, and business growth in premium sectors.',
      video: '/vienna-workshop.mp4',
      socials: { instagram: '#', linkedin: '#', behance: '#' }
    },
    {
      id: '5',
      name: 'Dr. Alistair Reed',
      role: 'Strategic Relations Mentor',
      image: '/team-5.jpg',
      bio: 'Dr. Reed is a strategic consultant who facilitates high-level industry connections. He coaches students on pitching, elite networking, and relationship building in the luxury market.',
      video: '/london-workshop.mp4',
      socials: { instagram: '#', linkedin: '#', behance: '#' }
    }
  ]);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/mentors')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setTeamMembers(data);
      })
      .catch(err => console.error('Failed to fetch mentors:', err));
  }, []);
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);

  return (
    <section ref={targetRef} id="team" className={styles.section}>
      <div className={styles.stickyContainer}>
        
        <div className={styles.intro}>
          <p className={styles.subtitle}>Teachers & Mentors</p>
          <h2 className={styles.title}>Learn from the Best.</h2>
          <p className={styles.description}>
            Our faculty includes elite casting directors, international fashion designers, and guest masterclass speakers who bring real-world mastery into every session. Click on any card to view their profile.
          </p>
        </div>

        <motion.div style={{ x }} className={styles.cardsContainer}>
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className={styles.card}
              onClick={() => setSelectedMember(member)}
              style={{ cursor: 'pointer' }}
            >
              <img src={member.image} alt={member.name} className={styles.image} />
              <div className={styles.cardOverlay}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
        
      </div>

      {/* Teacher Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div 
              className={styles.modalContainer}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className={styles.closeBtn} 
                onClick={() => setSelectedMember(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {/* Video introduction panel */}
              <div className={styles.videoSection}>
                <video 
                  key={selectedMember.video}
                  className={styles.modalVideo}
                  src={selectedMember.video}
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  {...{ "webkit-playsinline": "true" }}
                  controls
                  controlsList="nofullscreen"
                />
                <div className={styles.modalOverlayGradient}></div>
              </div>

              {/* Information panel */}
              <div className={styles.infoSection}>
                <h3 className={styles.modalName}>{selectedMember.name}</h3>
                <p className={styles.modalRole}>{selectedMember.role}</p>
                <p className={styles.modalBio}>{selectedMember.bio}</p>
                
                <div className={styles.socialRow}>
                  <a href={selectedMember.socials.instagram} className={styles.modalSocialLink} aria-label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                  <a href={selectedMember.socials.linkedin} className={styles.modalSocialLink} aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <a href={selectedMember.socials.behance} className={styles.modalSocialLink} aria-label="Behance">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
