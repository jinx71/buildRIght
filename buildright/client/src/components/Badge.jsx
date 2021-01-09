import React from 'react';

const TONES = {
  brand: 'bg-brand-100 text-brand-800',
  slate: 'bg-slate-100 text-slate-700',
  green: 'bg-emerald-100 text-emerald-800',
  blue: 'bg-sky-100 text-sky-800',
  red: 'bg-red-100 text-red-700',
  amber: 'bg-amber-100 text-amber-800',
};

const Badge = ({ tone = 'slate', className = '', children }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${TONES[tone]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
