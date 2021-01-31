// Small, dependency-free formatting helpers.

export const formatCurrency = (value, currency = 'EUR') => {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value));
};

export const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IE', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const titleCase = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);
