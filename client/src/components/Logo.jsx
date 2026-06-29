import React from 'react';

// Wordmark + a small structural "level/chevron" mark in amber.
const Logo = ({ light = false, className = '' }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 shadow-soft">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 18 L12 6 L21 18" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 18 L12 11.5 L17 18" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
      </svg>
    </span>
    <span className={`font-display text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
      Build<span className="text-brand-500">Right</span>
    </span>
  </span>
);

export default Logo;
