"use client";

import React, { useState, useRef } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker for pdfjs (newer versions use .mjs and unpkg is more reliable)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { setResumeData } = useResume();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatusMessage('Reading PDF...');

    try {
      // 1. Read PDF text
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
        
        // Extract hidden hyperlinks (e.g. \href in LaTeX)
        const annotations = await page.getAnnotations();
        const links = annotations
          .filter((a: any) => a.subtype === 'Link' && a.url)
          .map((a: any) => a.url);
        if (links.length > 0) {
          fullText += '\n[HIDDEN HYPERLINKS]: ' + links.join(', ') + '\n';
        }
      }

      if (fullText.trim() === '') {
        throw new Error('Could not extract any text from the PDF. It might be a scanned image.');
      }

      setStatusMessage('Analyzing with AI... (This may take a minute)');

      // 2. Send text to our API
      const res = await fetch('/api/extract-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText })
      });

      const jsonResponse = await res.json();

      if (!res.ok) {
        throw new Error(jsonResponse.details || jsonResponse.error || 'Failed to analyze resume');
      }

      // 3. Update the global state with safe fallbacks
      setResumeData(prev => ({
        ...prev,
        personalInfo: jsonResponse.data.personalInfo || { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', summary: '' },
        experience: jsonResponse.data.experience || [],
        education: jsonResponse.data.education || [],
        skills: jsonResponse.data.skills || [],
        projects: jsonResponse.data.projects || []
      }));
      setStatusMessage('Resume extracted successfully!');
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setStatusMessage('');
      }, 3000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during extraction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }} className="no-print">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: isDragging ? 'var(--accent-light)' : 'var(--bg-secondary)',
          cursor: isLoading ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <input 
          type="file" 
          accept=".pdf" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />
        
        {isLoading ? (
          <>
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)', animation: 'spin 2s linear infinite' }} />
            <div>
              <p style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{statusMessage}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Please do not close this window</p>
            </div>
          </>
        ) : statusMessage ? (
           <>
            <CheckCircle size={32} style={{ color: 'var(--success)' }} />
            <p style={{ fontWeight: 600, color: 'var(--success)' }}>{statusMessage}</p>
          </>
        ) : (
          <>
            <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: '50%' }}>
              <Upload size={24} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Auto-Fill from Resume</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Drag & drop your existing PDF resume here</p>
            </div>
          </>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', marginTop: '0.5rem', background: '#fef2f2', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
