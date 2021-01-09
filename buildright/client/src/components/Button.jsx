import React from 'react';

const VARIANTS = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-soft disabled:hover:bg-brand-500',
  secondary:
    'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 disabled:hover:bg-slate-900',
  outline:
    'border border-slate-300 text-slate-800 bg-white hover:border-brand-400 hover:text-brand-700',
  ghost: 'text-slate-700 hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

const Button = ({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => (
  <Tag
    className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150
      focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
      disabled:cursor-not-allowed disabled:opacity-60
      ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    {...props}
  >
    {children}
  </Tag>
);

export default Button;
