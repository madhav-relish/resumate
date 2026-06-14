"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // Import Quill styles

// Dynamically import react-quill-new to prevent SSR hydration errors in Next.js
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <div style={{ height: '100px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>Loading Editor...</div> });

type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ label, value, onChange }) => {
  // Define custom toolbar options
  const modules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean']
    ]
  }), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem', width: '100%' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
        {label}
      </label>
      <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <ReactQuill 
          theme="snow" 
          value={value} 
          onChange={onChange} 
          modules={modules}
          style={{ minHeight: '120px' }}
        />
      </div>
      
      {/* Add custom CSS to style the quill editor to match our theme */}
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: 1px solid var(--border-color);
          border-top-left-radius: var(--radius-md);
          border-top-right-radius: var(--radius-md);
          background-color: var(--bg-elevated);
        }
        .ql-container.ql-snow {
          border: 1px solid var(--border-color);
          border-top: none;
          border-bottom-left-radius: var(--radius-md);
          border-bottom-right-radius: var(--radius-md);
          font-family: inherit;
          font-size: 1rem;
        }
        .ql-editor {
          min-height: 120px;
        }
        .ql-editor p {
          margin-bottom: 0.5rem;
        }
        .ql-editor ul, .ql-editor ol {
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .ql-editor li {
          margin-bottom: 0.25rem;
        }
        .ql-editor a {
          color: var(--accent-primary);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
