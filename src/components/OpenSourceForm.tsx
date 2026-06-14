import React from 'react';
import { useResume, OpenSource } from '@/context/ResumeContext';
import { Input } from './Input';
import { RichTextEditor } from './RichTextEditor';
import { Card } from './Card';
import { Plus, Trash2 } from 'lucide-react';

export const OpenSourceForm = () => {
  const { resumeData, setResumeData } = useResume();

  const handleAdd = () => {
    const newOS: OpenSource = {
      id: crypto.randomUUID(),
      project: 'New Project',
      role: 'Contributor',
      description: '• Implemented a new feature for...',
      link: ''
    };
    setResumeData(prev => ({
      ...prev,
      openSource: [newOS, ...(prev.openSource || [])]
    }));
  };

  const handleRemove = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      openSource: (prev.openSource || []).filter(os => os.id !== id)
    }));
  };

  const handleChange = (id: string, field: keyof OpenSource, value: string) => {
    setResumeData(prev => ({
      ...prev,
      openSource: (prev.openSource || []).map(os => 
        os.id === id ? { ...os, [field]: value } : os
      )
    }));
  };

  return (
    <Card title="Open Source Contributions">
      {(resumeData.openSource || []).map((os, index) => (
        <div key={os.id} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: index < (resumeData.openSource || []).length - 1 ? '1px solid var(--border-color)' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button type="button" onClick={() => handleRemove(os.id)} style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Trash2 size={16} /> Remove
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <Input label="Project Name" value={os.project} onChange={e => handleChange(os.id, 'project', e.target.value)} />
            <Input label="Role" value={os.role} onChange={e => handleChange(os.id, 'role', e.target.value)} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <Input label="Link (Optional)" value={os.link} onChange={e => handleChange(os.id, 'link', e.target.value)} />
          </div>

          <RichTextEditor label="Description" value={os.description} onChange={(val) => handleChange(os.id, 'description', val)} />
        </div>
      ))}

      <button type="button" onClick={handleAdd} className="btn-secondary" style={{ width: '100%' }}>
        <Plus size={18} /> Add Open Source Contribution
      </button>
    </Card>
  );
};
