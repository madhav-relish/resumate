"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { useResume, PersonalInfo } from '@/context/ResumeContext';
import { Input } from './Input';
import { TextArea } from './TextArea';
import { Card } from './Card';
import { Save } from 'lucide-react';

export function PersonalInfoForm() {
  const { resumeData, setResumeData } = useResume();
  const { register, handleSubmit, formState: { isDirty } } = useForm<PersonalInfo>({
    defaultValues: resumeData.personalInfo,
  });

  const onSubmit = (data: PersonalInfo) => {
    setResumeData(prev => ({ ...prev, personalInfo: data }));
  };

  return (
    <Card title="Personal Information">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Full Name" {...register('fullName')} />
          <Input label="Job Title" {...register('jobTitle')} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Email" type="email" {...register('email')} />
          <Input label="Phone" {...register('phone')} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Location" {...register('location')} />
          <Input label="Website / Portfolio Link" {...register('website')} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="GitHub Profile (Optional)" {...register('github')} />
          <Input label="LinkedIn Profile (Optional)" {...register('linkedin')} />
        </div>

        <TextArea label="Professional Summary" {...register('summary')} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={!isDirty}>
            <Save size={18} />
            Save Details
          </button>
        </div>
      </form>
    </Card>
  );
}
