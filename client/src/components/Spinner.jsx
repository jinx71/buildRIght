import React from 'react';

const SIZES = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' };

const Spinner = ({ size = 'md', label = 'Loading', className = '' }) => (
  <div className={`flex flex-col items-center justify-center gap-3 ${className}`} role="status">
    <span
      className={`inline-block animate-spin rounded-full border-slate-200 border-t-brand-500 ${SIZES[size]}`}
    />
    <span className="sr-only">{label}</span>
  </div>
);

export default Spinner;
