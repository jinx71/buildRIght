import React, { forwardRef } from 'react';

const baseField =
  'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 ' +
  'transition-colors focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40';

const Field = ({ id, label, error, required, children }) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-brand-600">*</span>}
      </label>
    )}
    {children}
    {error && (
      <p className="text-xs font-medium text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
);

export const Input = forwardRef(({ id, label, error, required, className = '', ...props }, ref) => (
  <Field id={id} label={label} error={error} required={required}>
    <input
      id={id}
      ref={ref}
      aria-invalid={Boolean(error)}
      className={`${baseField} ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
      {...props}
    />
  </Field>
));
Input.displayName = 'Input';

export const Textarea = forwardRef(({ id, label, error, required, rows = 4, className = '', ...props }, ref) => (
  <Field id={id} label={label} error={error} required={required}>
    <textarea
      id={id}
      ref={ref}
      rows={rows}
      aria-invalid={Boolean(error)}
      className={`${baseField} resize-y ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
      {...props}
    />
  </Field>
));
Textarea.displayName = 'Textarea';

export const Select = forwardRef(({ id, label, error, required, children, className = '', ...props }, ref) => (
  <Field id={id} label={label} error={error} required={required}>
    <select
      id={id}
      ref={ref}
      aria-invalid={Boolean(error)}
      className={`${baseField} ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
      {...props}
    >
      {children}
    </select>
  </Field>
));
Select.displayName = 'Select';

export default Input;
