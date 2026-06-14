"use client";

import React from 'react';
import { useResume, Project } from '@/context/ResumeContext';
import { Input } from './Input';
import { RichTextEditor } from './RichTextEditor';
import { Card } from './Card';
import { Plus, Trash2 } from 'lucide-react';

export function ProjectsForm() {
  const { resumeData, setResumeData } = useResume();

  const handleAdd = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      link: '',
      githubLink: ''
    };
    setResumeData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const handleRemove = (id: string) => {
    setResumeData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const handleChange = (id: string, field: keyof Project, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  return (
    <Card title="Projects">
      {resumeData.projects.map((project, index) => (
        <div key={project.id} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: index < resumeData.projects.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button type="button" onClick={() => handleRemove(project.id)} style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Trash2 size={16} /> Remove
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <Input label="Project Title" value={project.title} onChange={e => handleChange(project.id, 'title', e.target.value)} />
            <Input label="Live Link (Optional)" value={project.link} onChange={e => handleChange(project.id, 'link', e.target.value)} />
            <Input label="GitHub Link (Optional)" value={project.githubLink || ''} onChange={e => handleChange(project.id, 'githubLink', e.target.value)} />
          </div>

          <div style={{ marginTop: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id={`portfolioOnly-${project.id}`}
              checked={!!project.portfolioOnly}
              onChange={e => handleChange(project.id, 'portfolioOnly', e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
            />
            <label htmlFor={`portfolioOnly-${project.id}`} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Show only on Portfolio (Hide from PDF Resume)
            </label>
          </div>

          <RichTextEditor label="Description" value={project.description} onChange={(val) => handleChange(project.id, 'description', val)} />
        </div>
      ))}

      <button type="button" onClick={handleAdd} className="btn-secondary" style={{ width: '100%' }}>
        <Plus size={18} /> Add Project
      </button>
    </Card>
  );
}
