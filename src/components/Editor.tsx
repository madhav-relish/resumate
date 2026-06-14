"use client";

import React from 'react';
import { ResumeUpload } from './ResumeUpload';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { OpenSourceForm } from './OpenSourceForm';

export function Editor() {
  return (
    <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }} className="no-print">
      <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Resume Details</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Upload your existing resume to auto-fill, or manually edit the fields below.
      </p>

      <ResumeUpload />
      
      <PersonalInfoForm />
      <ExperienceForm />
      <EducationForm />
      <SkillsForm />
      <ProjectsForm />
      <OpenSourceForm />
    </div>
  );
}
