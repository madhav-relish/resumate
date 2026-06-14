import React from 'react';

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem', width: '100%' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
        <textarea
          ref={ref}
          className={`input-field ${className}`}
          style={{ minHeight: '100px', resize: 'vertical' }}
          {...props}
        />
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';
