import React from 'react';

const SectionHeading = ({ eyebrow, title, subtitle, align = 'left', className = '' }) => (
  <div className={`${align === 'center' ? 'text-center mx-auto' : ''} max-w-2xl ${className}`}>
    {eyebrow && (
      <span className="eyebrow">
        <span className="h-px w-6 bg-brand-500" aria-hidden="true" />
        {eyebrow}
      </span>
    )}
    <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h2>
    {subtitle && <p className="mt-3 text-base leading-relaxed text-slate-600">{subtitle}</p>}
  </div>
);

export default SectionHeading;
