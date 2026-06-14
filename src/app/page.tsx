"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Mail, MapPin, Code } from 'lucide-react';
import { linkify } from '@/utils/linkify';
import { formatDate, sortChronologically } from '@/utils/date';
import { motion, useScroll } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// 1. Interactive Cursor Glow
const CursorGlow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.08), transparent 40%)`
      }}
      className="no-print"
    />
  );
};

// 2. Grain / Noise Overlay
const NoiseOverlay = () => (
  <div 
    style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      pointerEvents: 'none',
      zIndex: 100, // On top of everything but pointerEvents none
      mixBlendMode: 'overlay',
      opacity: 0.3,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

const ScrollCurve = ({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) => {
  const { scrollYProgress } = useScroll({ container: targetRef });
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, opacity: 0.15, pointerEvents: 'none' }} className="no-print">
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        {/* Faint Background Track */}
        <path
          d="M 500 0 C 900 150, 900 250, 500 400 C 100 550, 100 650, 500 750 C 900 850, 900 950, 500 1000"
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="4"
        />
        {/* Glowing Animated Progress Line */}
        <motion.path
          d="M 500 0 C 900 150, 900 250, 500 400 C 100 550, 100 650, 500 750 C 900 850, 900 950, 500 1000"
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="8"
          style={{ pathLength: scrollYProgress, filter: 'drop-shadow(0 0 12px var(--accent-primary))' }}
        />
      </svg>
    </div>
  );
};

export default function PortfolioPage() {
  const { resumeData } = useResume();
  const { personalInfo, experience, projects, skills, education, openSource = [] } = resumeData;
  const containerRef = useRef<HTMLDivElement>(null);

  const sortedExperience = sortChronologically(experience);
  const sortedEducation = sortChronologically(education);

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || skill.level || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  const getDeviconClass = (skillName: string) => {
    const name = skillName.toLowerCase().trim();
    if (name.includes('react')) return 'devicon-react-original';
    if (name.includes('next')) return 'devicon-nextjs-plain';
    if (name.includes('node')) return 'devicon-nodejs-plain';
    if (name.includes('typescript') || name.includes('ts')) return 'devicon-typescript-plain';
    if (name.includes('javascript') || name.includes('js')) return 'devicon-javascript-plain';
    if (name.includes('html')) return 'devicon-html5-plain';
    if (name.includes('css')) return 'devicon-css3-plain';
    if (name.includes('sass') || name.includes('scss')) return 'devicon-sass-original';
    if (name.includes('tailwind')) return 'devicon-tailwindcss-original';
    if (name.includes('python')) return 'devicon-python-plain';
    if (name.includes('java')) return 'devicon-java-plain';
    if (name.includes('mongo')) return 'devicon-mongodb-plain';
    if (name.includes('sql') || name.includes('postgres')) return 'devicon-postgresql-plain';
    if (name.includes('aws')) return 'devicon-amazonwebservices-original';
    if (name.includes('docker')) return 'devicon-docker-plain';
    if (name.includes('git')) return 'devicon-git-plain';
    if (name.includes('figma')) return 'devicon-figma-plain';
    if (name.includes('prisma')) return 'devicon-prisma-original';
    if (name.includes('express')) return 'devicon-express-original';
    if (name.includes('redux')) return 'devicon-redux-original';
    if (name.includes('bootstrap')) return 'devicon-bootstrap-plain';
    if (name.includes('jest')) return 'devicon-jest-plain';
    if (name.includes('vue')) return 'devicon-vuejs-plain';
    if (name.includes('angular')) return 'devicon-angularjs-plain';
    if (name.includes('firebase')) return 'devicon-firebase-plain';
    if (name.includes('graphql')) return 'devicon-graphql-plain';
    return null;
  };

  const firstName = personalInfo.fullName ? personalInfo.fullName.split(' ')[0] : 'Visitor';

  return (
    <div ref={containerRef} style={{ height: '100vh', backgroundColor: 'var(--bg-primary)', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
      
      {/* Visual Upgrades */}
      <NoiseOverlay />
      <CursorGlow />
      <ScrollCurve targetRef={containerRef} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}
        >
          <Link href="/editor" className="btn-secondary" style={{ border: 'none', background: 'var(--bg-elevated)', backdropFilter: 'blur(10px)' }}>
            <ArrowLeft size={18} /> Back to Editor
          </Link>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.05em' }}>
            {firstName.toLowerCase()}<span style={{ color: 'var(--accent-primary)' }}>.</span>portfolio
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '6rem' }}
        >
          <motion.div variants={fadeInUp} style={{ display: 'inline-block', padding: '0.5rem 1.25rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem', width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ color: 'var(--accent-primary)', marginRight: '0.5rem' }}>●</span> {personalInfo.jobTitle || 'Professional'}
          </motion.div>
          
          <motion.h1 variants={fadeInUp} style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Hi, I'm <span style={{ background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{firstName}.</span><br />
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 700 }}>I build digital experiences.</span>
          </motion.h1>
          
          <motion.div variants={fadeInUp} style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6, marginBottom: '3rem', whiteSpace: 'pre-wrap' }}>
            {linkify(personalInfo.summary || 'A passionate professional looking to make an impact.')}
          </motion.div>

          <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.05rem' }}>
                <Mail size={18} /> Contact Me
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.05rem', background: '#0a66c2' }}>
                <i className="devicon-linkedin-plain" style={{ fontSize: '1.2rem' }}></i> LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1.05rem', background: 'var(--bg-elevated)' }}>
                <i className="devicon-github-original" style={{ fontSize: '1.2rem' }}></i> GitHub
              </a>
            )}
            {personalInfo.location && (
              <div className="btn-secondary" style={{ cursor: 'default', padding: '0.875rem 2rem', fontSize: '1.05rem', background: 'var(--bg-elevated)' }}>
                <MapPin size={18} /> {personalInfo.location}
              </div>
            )}
          </motion.div>
        </motion.section>

        {/* Projects Showcase */}
        {projects.length > 0 && (
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ root: containerRef, once: true, margin: "-100px" }}
            variants={staggerContainer}
            style={{ marginBottom: '8rem' }}
          >
            <motion.h2 variants={fadeInUp} style={{ fontSize: '2.5rem', marginBottom: '3rem', letterSpacing: '-0.02em' }}>Selected Projects</motion.h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {projects.map(project => (
                <motion.div 
                  variants={fadeInUp}
                  key={project.id} 
                  className="glass-panel" 
                  style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                  whileHover={{ y: -10, boxShadow: 'var(--shadow-glass)', borderColor: 'var(--accent-primary)' }}
                >
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>{project.title}</h3>
                  {/<[a-z][\s\S]*>/i.test(project.description) ? (
                    <div style={{ color: 'var(--text-secondary)', flex: 1, marginBottom: '2rem', lineHeight: 1.6, overflowWrap: 'break-word' }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: project.description.replace(/&nbsp;/g, ' ') }} />
                  ) : (
                    <div style={{ color: 'var(--text-secondary)', flex: 1, marginBottom: '2rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                      {linkify(project.description.replace(/&nbsp;/g, ' '))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {project.link && (
                      <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 600, padding: '0.5rem 1rem', background: 'var(--accent-light)', borderRadius: 'var(--radius-full)', width: 'fit-content', transition: 'all 0.2s' }} className="hover:opacity-80">
                        View Project <ExternalLink size={16} />
                      </a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink.startsWith('http') ? project.githubLink : `https://${project.githubLink}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, padding: '0.5rem 1rem', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', width: 'fit-content', transition: 'all 0.2s' }} className="hover:opacity-80">
                        Source Code <Code size={16} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Open Source Contributions */}
        {openSource.length > 0 && (
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ root: containerRef, once: true, margin: "-100px" }}
            variants={staggerContainer}
            style={{ marginBottom: '8rem' }}
          >
            <motion.h2 variants={fadeInUp} style={{ fontSize: '2.5rem', marginBottom: '3rem', letterSpacing: '-0.02em' }}>Open Source</motion.h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {openSource.map(os => (
                <motion.div 
                  variants={fadeInUp}
                  key={os.id} 
                  className="glass-panel" 
                  style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                  whileHover={{ y: -10, boxShadow: 'var(--shadow-glass)', borderColor: 'var(--accent-primary)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{os.project}</h3>
                    <span style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 600, padding: '0.25rem 0.75rem', background: 'var(--accent-light)', borderRadius: 'var(--radius-full)' }}>{os.role}</span>
                  </div>
                  {/<[a-z][\s\S]*>/i.test(os.description) ? (
                    <div style={{ color: 'var(--text-secondary)', flex: 1, marginBottom: '2rem', lineHeight: 1.6, overflowWrap: 'break-word' }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: os.description.replace(/&nbsp;/g, ' ') }} />
                  ) : (
                    <div style={{ color: 'var(--text-secondary)', flex: 1, marginBottom: '2rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                      {linkify(os.description.replace(/&nbsp;/g, ' '))}
                    </div>
                  )}
                  {os.link && (
                    <a href={os.link.startsWith('http') ? os.link : `https://${os.link}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, transition: 'all 0.2s' }} className="hover:opacity-80">
                      View Contribution <ExternalLink size={16} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience & Bento Box Area */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
          
          {/* Experience Timeline */}
          {sortedExperience.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ root: containerRef, once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} style={{ fontSize: '2.5rem', marginBottom: '3rem', letterSpacing: '-0.02em' }}>Experience</motion.h2>
              <div style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '2.5rem', marginLeft: '1rem' }}>
                {sortedExperience.map((exp, i) => (
                  <motion.div variants={fadeInUp} key={exp.id} style={{ position: 'relative', marginBottom: i === experience.length - 1 ? 0 : '4rem' }}>
                    <div style={{ position: 'absolute', left: '-3rem', top: '0.25rem', width: '16px', height: '16px', borderRadius: '50%', background: exp.current ? 'var(--accent-primary)' : 'var(--bg-secondary)', border: `3px solid ${exp.current ? 'var(--bg-primary)' : 'var(--border-color)'}`, boxShadow: exp.current ? '0 0 0 3px var(--accent-light)' : 'none', zIndex: 2 }} />
                    <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0', fontWeight: 700 }}>{exp.position}</h3>
                    <div style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{exp.company}</div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {formatDate(exp.startDate || '')} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                    </div>
                    {/<[a-z][\s\S]*>/i.test(exp.description) ? (
                      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, wordBreak: 'break-word', overflowWrap: 'break-word' }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
                    ) : (
                      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {linkify(exp.description)}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Right Column: Bento Box Grid (Skills + Education) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ root: containerRef, once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} style={{ fontSize: '2.5rem', marginBottom: '3rem', letterSpacing: '-0.02em' }}>Expertise & Background</motion.h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', gridAutoFlow: 'dense' }}>
                
                {/* Education Bento Cards (Span 2 columns) */}
                {sortedEducation.map(edu => (
                  <motion.div 
                    variants={fadeInUp} 
                    key={edu.id} 
                    className="glass-panel" 
                    style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', gridColumn: 'span 2', background: 'var(--bg-secondary)' }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Education</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem', lineHeight: 1.3 }}>{edu.degree} in {edu.field}</h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{edu.institution}</div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>{formatDate(edu.startDate || '')} - {formatDate(edu.endDate || '')}</div>
                  </motion.div>
                ))}

                {/* Skills Bento Cards */}
                {Object.entries(groupedSkills).map(([category, items]) => (
                  <motion.div 
                    variants={fadeInUp} 
                    key={category} 
                    className="glass-panel" 
                    style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', gridColumn: 'span 2', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}
                    whileHover={{ scale: 1.02, background: 'var(--bg-elevated)', borderColor: 'var(--accent-primary)' }}
                  >
                    <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '1rem' }}>{category}</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                      {items.map(skill => {
                        const iconClass = getDeviconClass(skill);
                        return (
                          <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', fontWeight: 500, border: '1px solid var(--border-color)' }}>
                            {iconClass && <i className={`${iconClass} colored`} style={{ fontSize: '1.25rem' }}></i>}
                            {skill}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}

              </div>
            </motion.div>
          </div>

        </section>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ root: containerRef, once: true }}
          style={{ textAlign: 'center', padding: '4rem 0 2rem 0', color: 'var(--text-tertiary)', fontSize: '0.875rem', borderTop: '1px solid var(--border-color)' }}
        >
          <p>© {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.</p>
        </motion.footer>

      </div>
    </div>
  );
}
