import api from './axios';

// Each helper returns the `data` payload from our { success, data, message } envelope.

// ── Auth ────────────────────────────────────────
export const loginRequest = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data.data; // { token, user }
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.user;
};

// ── Projects (filterable gallery) ───────────────
export const getProjects = async (category = 'all') => {
  const { data } = await api.get('/projects', { params: { category } });
  return data.data.projects;
};

// ── Quotes ──────────────────────────────────────
export const submitQuote = async (payload) => {
  const { data } = await api.post('/quotes', payload);
  return data; // full envelope so the caller can read `message`
};

export const getQuotes = async (status = '') => {
  const { data } = await api.get('/quotes', { params: status ? { status } : {} });
  return data.data.quotes;
};

export const updateQuoteStatus = async (id, status) => {
  const { data } = await api.patch(`/quotes/${id}/status`, { status });
  return data.data.quote;
};

export const deleteQuote = async (id) => {
  const { data } = await api.delete(`/quotes/${id}`);
  return data;
};

// ── Permits (proxied + cached external API) ─────
export const getPermits = async ({ limit = 24, q = '' } = {}) => {
  const { data } = await api.get('/permits', { params: { limit, q } });
  return data.data; // { permits, source }
};
