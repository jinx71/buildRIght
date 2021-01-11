import React from 'react';
import Button from './Button';

export const EmptyState = ({ title = 'Nothing here yet', message = '', icon = '📭', action }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
    <div className="mb-3 text-4xl" aria-hidden="true">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    {message && <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const ErrorState = ({ message = 'We couldn’t load this right now.', onRetry }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
    <div className="mb-3 text-4xl" aria-hidden="true">
      ⚠️
    </div>
    <h3 className="text-lg font-semibold text-red-800">Couldn’t load</h3>
    <p className="mt-1 max-w-sm text-sm text-red-600">{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

export default EmptyState;
