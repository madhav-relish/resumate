import React from 'react';

export function Card({ children, className = "", title }: { children: React.ReactNode, className?: string, title?: string }) {
  return (
    <div className={`glass-panel ${className}`} style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {title && <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)', fontSize: '1.25rem' }}>{title}</h3>}
      {children}
    </div>
  );
}
