"use client";

import React from 'react';
import { useResume, Education } from '@/context/ResumeContext';
import { Input } from './Input';
import { Card } from './Card';
import { Plus, Trash2 } from 'lucide-react';

export function EducationForm() {
  const { resumeData, setResumeData } = useResume();

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    };
    setResumeData({ ...resumeData, education: [newEdu, ...resumeData.education] });
  };

  const handleRemove = (id: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  const handleChange = (id: string, field: keyof Education, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  return (
    <Card title="Education">
      {resumeData.education.map((edu, index) => (
        <div key={edu.id} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: index < resumeData.education.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button type="button" onClick={() => handleRemove(edu.id)} style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Trash2 size={16} /> Remove
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <Input label="Institution" value={edu.institution} onChange={e => handleChange(edu.id, 'institution', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Degree (e.g. BS, BA)" value={edu.degree} onChange={e => handleChange(edu.id, 'degree', e.target.value)} />
            <Input label="Field of Study" value={edu.field} onChange={e => handleChange(edu.id, 'field', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Start Date</label>
              <input type="month" className="input-field" value={edu.startDate || ''} onChange={(e) => handleChange(edu.id, 'startDate', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>End Date</label>
              <input type="month" className="input-field" value={edu.endDate || ''} onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={addEducation} className="btn-secondary" style={{ width: '100%' }}>
        <Plus size={18} /> Add Education
      </button>
    </Card>
  );
}
