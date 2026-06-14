"use client";

import React, { useEffect } from 'react';
import { useResume, ResumeData } from '@/context/ResumeContext';
import { linkify } from '@/utils/linkify';
import { formatDate, sortChronologically } from '@/utils/date';

// Helper component to render descriptions with preserved newlines and auto-linking
const FormattedText = ({ text, style }: { text: string, style?: React.CSSProperties }) => {
  const cleanText = text.replace(/&nbsp;/g, ' ');
  const hasHTML = /<[a-z][\s\S]*>/i.test(cleanText);
  if (hasHTML) {
    return <div style={{ overflowWrap: 'break-word', ...style }} dangerouslySetInnerHTML={{ __html: cleanText }} className="rich-text-content" />;
  }
  return <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', ...style }}>{linkify(cleanText)}</div>;
};

// -------------------------------------------------------------
// 1. CLASSIC TEMPLATE
// -------------------------------------------------------------
const ClassicTemplate = ({ data }: { data: ResumeData }) => {
  const { personalInfo = {} as any, experience = [], education = [], skills = [], projects = [], openSource = [] } = data;
  const sortedExperience = sortChronologically(experience);
  const sortedEducation = sortChronologically(education);
  const atsProjects = projects.filter(p => !p.portfolioOnly);
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || (skill as any).level || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);
  return (
    <div style={{ fontFamily: '"Times New Roman", Times, serif', color: 'black', padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>{personalInfo.fullName}</h1>
        <div style={{ fontSize: '1rem' }}>
          {personalInfo.email} 
          {personalInfo.phone && <span> | {personalInfo.phone}</span>} 
          {personalInfo.location && <span> | {personalInfo.location}</span>} 
          {personalInfo.website && <span> | <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Portfolio ↗</a></span>} 
          {personalInfo.linkedin && <span> | <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>LinkedIn ↗</a></span>} 
          {personalInfo.github && <span> | <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub ↗</a></span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1rem', lineHeight: '1.4' }}><FormattedText text={personalInfo.summary} /></div>
        </section>
      )}

      {experience.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', borderBottom: '1px solid black', marginBottom: '0.75rem' }}>Experience</h2>
          {sortedExperience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>{exp.position}</span>
                <span>{formatDate(exp.startDate || '')} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}</span>
              </div>
              <div style={{ fontStyle: 'italic', marginBottom: '0.5rem', fontSize: '1.05rem' }}>{exp.company}</div>
              <FormattedText text={exp.description} style={{ fontSize: '1rem', lineHeight: '1.4' }} />
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', borderBottom: '1px solid black', marginBottom: '0.75rem' }}>Education</h2>
          {sortedEducation.map(edu => (
            <div key={edu.id} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>{edu.institution}</span>
                <span>{formatDate(edu.startDate || '')} - {formatDate(edu.endDate || '')}</span>
              </div>
              <div style={{ fontSize: '1.05rem' }}>{edu.degree} in {edu.field}</div>
            </div>
          ))}
        </section>
      )}

      {atsProjects.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', borderBottom: '1px solid black', marginBottom: '0.75rem' }}>Projects</h2>
          {atsProjects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {proj.title} {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'normal', fontSize: '0.9rem', fontStyle: 'italic', color: '#555', textDecoration: 'none' }}>(View Project ↗)</a>}
                {proj.githubLink && <a href={proj.githubLink.startsWith('http') ? proj.githubLink : `https://${proj.githubLink}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'normal', fontSize: '0.9rem', fontStyle: 'italic', color: '#555', textDecoration: 'none', marginLeft: '0.5rem' }}>(Source Code ↗)</a>}
              </div>
              <FormattedText text={proj.description} style={{ fontSize: '1rem', lineHeight: '1.4', marginTop: '0.25rem' }} />
            </div>
          ))}
        </section>
      )}

      {openSource.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', borderBottom: '1px solid black', marginBottom: '0.75rem' }}>Open Source Contributions</h2>
          {openSource.map(os => (
            <div key={os.id} style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {os.project} <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>- {os.role}</span>
                {os.link && <a href={os.link.startsWith('http') ? os.link : `https://${os.link}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'normal', fontSize: '0.9rem', fontStyle: 'italic', marginLeft: '0.5rem', color: '#555', textDecoration: 'none' }}>(View Contribution ↗)</a>}
              </div>
              <FormattedText text={os.description} style={{ fontSize: '1rem', lineHeight: '1.4', marginTop: '0.25rem' }} />
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', borderBottom: '1px solid black', marginBottom: '0.75rem' }}>Skills</h2>
          <div style={{ fontSize: '1rem', lineHeight: '1.4' }}>
            {Object.entries(groupedSkills).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: '0.25rem' }}>
                <strong>{cat}:</strong> {items.join(', ')}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 2. MODERN TEMPLATE
// -------------------------------------------------------------
const ModernTemplate = ({ data }: { data: ResumeData }) => {
  const { personalInfo = {} as any, experience = [], education = [], skills = [], projects = [], openSource = [] } = data;
  const sortedExperience = sortChronologically(experience);
  const sortedEducation = sortChronologically(education);
  const atsProjects = projects.filter(p => !p.portfolioOnly);
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || (skill as any).level || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);
  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: '#333', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--accent-primary)', lineHeight: 1 }}>{personalInfo.fullName}</h1>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, margin: '0.5rem 0 0 0', color: '#555' }}>{personalInfo.jobTitle}</h2>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.website && <div><a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Portfolio ↗</a></div>}
          {personalInfo.linkedin && <div><a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>LinkedIn ↗</a></div>}
          {personalInfo.github && <div><a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub ↗</a></div>}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '85fr 15fr', gap: '1.5rem' }}>
        <div>
          {personalInfo.summary && (
            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Summary</h3>
              <FormattedText text={personalInfo.summary} style={{ fontSize: '0.95rem', lineHeight: '1.6' }} />
            </section>
          )}

          {experience.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Experience</h3>
              {sortedExperience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#111' }}>{exp.position}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', fontWeight: 500 }}>
                    <span>{exp.company}</span>
                    <span>{formatDate(exp.startDate || '')} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}</span>
                  </div>
                  <FormattedText text={exp.description} style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#444' }} />
                </div>
              ))}
            </section>
          )}

          {atsProjects.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Projects</h3>
              {atsProjects.map(proj => (
                <div key={proj.id} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#111' }}>
                    {proj.title} {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'normal', fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>| View Project ↗</a>}
                    {proj.githubLink && <a href={proj.githubLink.startsWith('http') ? proj.githubLink : `https://${proj.githubLink}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'normal', fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none', marginLeft: '0.5rem' }}>| Source Code ↗</a>}
                  </div>
                  <FormattedText text={proj.description} style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#444', marginTop: '0.25rem' }} />
                </div>
              ))}
            </section>
          )}

          {openSource.length > 0 && (
            <section>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Open Source Contributions</h3>
              {openSource.map(os => (
                <div key={os.id} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#111' }}>
                    {os.project} <span style={{ fontWeight: 'normal', fontSize: '1rem', color: '#444' }}>- {os.role}</span>
                    {os.link && <a href={os.link.startsWith('http') ? os.link : `https://${os.link}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'normal', fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none' }}> | View Contribution ↗</a>}
                  </div>
                  <FormattedText text={os.description} style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#444', marginTop: '0.25rem' }} />
                </div>
              ))}
            </section>
          )}

        </div>

        <div>
          {education.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Education</h3>
              {sortedEducation.map(edu => (
                <div key={edu.id} style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111' }}>{edu.degree} in {edu.field}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 500 }}>{edu.institution}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{formatDate(edu.startDate || '')} - {formatDate(edu.endDate || '')}</div>
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Skills</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(groupedSkills).map(([cat, items]) => (
                  <div key={cat} style={{ fontSize: '0.95rem' }}>
                    <strong style={{ color: '#111', display: 'block', marginBottom: '0.2rem' }}>{cat}</strong>
                    <div style={{ color: '#444', lineHeight: '1.4' }}>{items.join(', ')}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. MINIMALIST TEMPLATE
// -------------------------------------------------------------
const MinimalistTemplate = ({ data }: { data: ResumeData }) => {
  const { personalInfo = {} as any, experience = [], education = [], skills = [], projects = [], openSource = [] } = data;
  const sortedExperience = sortChronologically(experience);
  const sortedEducation = sortChronologically(education);
  const atsProjects = projects.filter(p => !p.portfolioOnly);
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || (skill as any).level || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#222', padding: '2rem', fontSize: '0.9rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{personalInfo.fullName}</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#555' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Portfolio ↗</a></span>}
          {personalInfo.linkedin && <span>• <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>LinkedIn ↗</a></span>}
          {personalInfo.github && <span>• <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub ↗</a></span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section style={{ marginBottom: '1rem' }}>
          <FormattedText text={personalInfo.summary} style={{ lineHeight: '1.4' }} />
        </section>
      )}

      {experience.length > 0 && (
        <section style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', borderBottom: '1px solid #ccc', textTransform: 'uppercase', marginBottom: '0.5rem', paddingBottom: '0.2rem' }}>Experience</h2>
          {sortedExperience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{exp.company} - {exp.position}</span>
                <span>{formatDate(exp.startDate || '')} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}</span>
              </div>
              <FormattedText text={exp.description} style={{ lineHeight: '1.4', marginTop: '0.2rem', color: '#333' }} />
            </div>
          ))}
        </section>
      )}

      {atsProjects.length > 0 && (
        <section style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', borderBottom: '1px solid #ccc', textTransform: 'uppercase', marginBottom: '0.5rem', paddingBottom: '0.2rem' }}>Projects</h2>
          {atsProjects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 'bold' }}>
                {proj.title} {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'normal', color: '#555', textDecoration: 'none' }}>| View Project ↗</a>}
                {proj.githubLink && <a href={proj.githubLink.startsWith('http') ? proj.githubLink : `https://${proj.githubLink}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'normal', color: '#555', textDecoration: 'none', marginLeft: '0.5rem' }}>| Source Code ↗</a>}
              </div>
              <FormattedText text={proj.description} style={{ lineHeight: '1.4', marginTop: '0.2rem', color: '#333' }} />
            </div>
          ))}
        </section>
      )}

      {openSource.length > 0 && (
        <section style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', borderBottom: '1px solid #ccc', textTransform: 'uppercase', marginBottom: '0.5rem', paddingBottom: '0.2rem' }}>Open Source Contributions</h2>
          {openSource.map(os => (
            <div key={os.id} style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 'bold' }}>
                {os.project} - <span style={{ fontWeight: 'normal' }}>{os.role}</span>
                {os.link && <a href={os.link.startsWith('http') ? os.link : `https://${os.link}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'normal', color: '#555', textDecoration: 'none' }}> | View Contribution ↗</a>}
              </div>
              <FormattedText text={os.description} style={{ lineHeight: '1.4', marginTop: '0.2rem', color: '#333' }} />
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', borderBottom: '1px solid #ccc', textTransform: 'uppercase', marginBottom: '0.5rem', paddingBottom: '0.2rem' }}>Education</h2>
          {education.map(edu => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span><strong style={{ fontWeight: 'bold' }}>{edu.institution}</strong>, {edu.degree} in {edu.field}</span>
              <span>{formatDate(edu.startDate || '')} - {formatDate(edu.endDate || '')}</span>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1rem', borderBottom: '1px solid #ccc', textTransform: 'uppercase', marginBottom: '0.5rem', paddingBottom: '0.2rem' }}>Skills</h2>
          <div style={{ lineHeight: '1.4' }}>
            {Object.entries(groupedSkills).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: '0.25rem' }}>
                <strong>{cat}:</strong> {items.join(', ')}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};


// -------------------------------------------------------------
// MAIN PREVIEW COMPONENT
// -------------------------------------------------------------
export function ResumePreview() {
  const { resumeData, setResumeData } = useResume();
  const template = resumeData.selectedTemplate || 'modern';

  useEffect(() => {
    if (resumeData?.personalInfo?.fullName) {
      document.title = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume`;
    } else {
      document.title = "Resumate_Resume";
    }
  }, [resumeData?.personalInfo?.fullName]);

  const handleTemplateChange = (t: string) => {
    setResumeData(prev => ({ ...prev, selectedTemplate: t }));
  };

  return (
    <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.15)', textAlign: 'center' }} className="print-safe no-print-bg">
      
      {/* Template Selector UI (Hidden in Print Mode) */}
      <div className="glass-panel no-print" style={{ display: 'inline-flex', gap: '0.5rem', padding: '0.5rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-full)' }}>
        {['modern', 'classic', 'minimalist'].map(t => (
          <button
            key={t}
            onClick={() => handleTemplateChange(t)}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              background: template === t ? 'var(--accent-primary)' : 'transparent',
              color: template === t ? 'white' : 'var(--text-primary)',
              textTransform: 'capitalize',
              fontWeight: template === t ? 600 : 500,
              transition: 'all 0.2s ease',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Actual A4 Page Container */}
      <div 
        style={{ 
          width: '100%',
          maxWidth: '800px', 
          backgroundColor: 'white', 
          boxShadow: 'var(--shadow-lg)',
          minHeight: '1056px', // Approx A4/Letter
          marginBottom: '2rem', // Add some margin at the bottom so it doesn't stick to the scroll edge
          margin: '0 auto',
          textAlign: 'left'
        }}
        className="print-only-container"
      >
        {template === 'classic' && <ClassicTemplate data={resumeData} />}
        {template === 'modern' && <ModernTemplate data={resumeData} />}
        {template === 'minimalist' && <MinimalistTemplate data={resumeData} />}
      </div>
    </div>
  );
}
