"use client";

import React from 'react';
import { useResume, Experience } from '@/context/ResumeContext';
import { Input } from './Input';
import { RichTextEditor } from './RichTextEditor';
import { Card } from './Card';
import { Plus, Trash2 } from 'lucide-react';

export function ExperienceForm() {
  const { resumeData, setResumeData } = useResume();

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setResumeData({ ...resumeData, experience: [newExp, ...resumeData.experience] });
  };

  const handleRemove = (id: string) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const handleChange = (id: string, field: keyof Experience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  return (
    <Card title="Experience">
      {resumeData.experience.map((exp, index) => (
        <div key={exp.id} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: index < resumeData.experience.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button type="button" onClick={() => handleRemove(exp.id)} style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Trash2 size={16} /> Remove
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Company" value={exp.company} onChange={e => handleChange(exp.id, 'company', e.target.value)} />
            <Input label="Position" value={exp.position} onChange={e => handleChange(exp.id, 'position', e.target.value)} />
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Start Date</label>
              <input type="month" className="input-field" value={exp.startDate || ''} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>End Date</label>
              <input type={exp.current ? "text" : "month"} className="input-field" value={exp.current ? "Present" : (exp.endDate === 'Present' ? '' : exp.endDate || '')} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id={`current-${exp.id}`} checked={exp.current} onChange={e => handleChange(exp.id, 'current', e.target.checked)} />
            <label htmlFor={`current-${exp.id}`}>I currently work here</label>
          </div>

          <RichTextEditor label="Description" value={exp.description} onChange={(val) => handleChange(exp.id, 'description', val)} />
        </div>
      ))}

      <button type="button" onClick={addExperience} className="btn-secondary" style={{ width: '100%' }}>
        <Plus size={18} /> Add Experience
      </button>
    </Card>
  );
}
