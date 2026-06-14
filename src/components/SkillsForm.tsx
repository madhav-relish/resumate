"use client";

import React from 'react';
import { useResume, Skill } from '@/context/ResumeContext';
import { Input } from './Input';
import { Card } from './Card';
import { Plus, Trash2 } from 'lucide-react';

export function SkillsForm() {
  const { resumeData, setResumeData } = useResume();

  const handleAdd = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      category: 'Frontend'
    };
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
  };

  const handleRemove = (id: string) => {
    setResumeData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
  };

  const handleChange = (id: string, field: keyof Skill, value: any) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  return (
    <Card title="Skills">
      {resumeData.skills.map(skill => (
        <div key={skill.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ flex: 2 }}>
            <Input label="Skill Name" value={skill.name} onChange={e => handleChange(skill.id, 'name', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Category</label>
              <select 
                className="input-field" 
                value={skill.category || skill.level} // Fallback to level for backwards compatibility
                onChange={e => handleChange(skill.id, 'category', e.target.value)}
              >
                <option value="Frontend">Frontend</option>
                <option value="State Management">State Management</option>
                <option value="UI Libraries">UI Libraries</option>
                <option value="Testing">Testing</option>
                <option value="Backend & APIs">Backend & APIs</option>
                <option value="Databases">Databases</option>
                <option value="Architecture & Performance">Architecture & Performance</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
          </div>
          <div style={{ paddingTop: '1.75rem' }}>
            <button type="button" onClick={() => handleRemove(skill.id)} style={{ color: 'var(--danger)', padding: '0.5rem' }}>
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      <button type="button" onClick={handleAdd} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
        <Plus size={18} /> Add Skill
      </button>
    </Card>
  );
}
