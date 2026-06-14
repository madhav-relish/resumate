import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem', width: '100%' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
        <input
          ref={ref}
          className={`input-field ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
