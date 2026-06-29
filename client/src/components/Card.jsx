import React from 'react';

const Card = ({ as: Tag = 'div', hover = false, className = '', children, ...props }) => (
  <Tag
    className={`rounded-xl border border-slate-200 bg-white shadow-soft
      ${hover ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lift' : ''}
      ${className}`}
    {...props}
  >
    {children}
  </Tag>
);

export default Card;
