"use client";

import React from 'react';
import { Editor } from '@/components/Editor';
import { ResumePreview } from '@/components/ResumePreview';
import { Download, Layout } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-safe" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top Navigation Bar */}
      <nav className="glass-panel no-print" style={{ 
        padding: '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 10,
        borderRadius: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
            R
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.05em' }}>resumate</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/portfolio" className="btn-secondary">
            <Layout size={18} />
            Generate Portfolio
          </Link>
          <button className="btn-primary" onClick={handlePrint}>
            <Download size={18} />
            Export ATS PDF
          </button>
        </div>
      </nav>

      {/* Main Split Layout */}
      <main className="print-safe" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Side - Editor */}
        <div style={{ flex: 1, borderRight: '1px solid var(--border-color)', position: 'relative' }} className="no-print">
          <Editor />
        </div>

        {/* Right Side - Preview */}
        <div className="print-safe" style={{ flex: 1, position: 'relative' }}>
          <ResumePreview />
        </div>
      </main>
    </div>
  );
}
