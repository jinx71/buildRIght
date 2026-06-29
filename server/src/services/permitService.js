const axios = require('axios');
const NodeCache = require('node-cache');

/**
 * ENGINEERING LESSON (data layer):
 * The external building-permits dataset (Socrata SODA API) is keyless but
 * rate-limited. We proxy it through Express so the React client only ever
 * talks to our own /api routes, and we wrap it in a 10-minute cache so that
 * repeated page loads / refreshes are absorbed here instead of hammering the
 * third party. If the dataset is unreachable, we serve sample data — the UI
 * never shows a blank screen.
 */

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const BASE_URL =
  process.env.PERMITS_BASE_URL ||
  'https://data.cityofchicago.org/resource/ydr8-5enu.json';

// Socrata field names vary by dataset, so read a few likely keys defensively.
const normalize = (row, i) => {
  const address =
    row.street_number && row.street_name
      ? `${row.street_number} ${row.street_direction || ''} ${row.street_name} ${row.suffix || ''}`
          .replace(/\s+/g, ' ')
          .trim()
      : row.address || row.contact_1_address || 'Address on file';

  return {
    id: row.id || row.permit_ || row.permit_number || `permit-${i}`,
    number: row.permit_ || row.permit_number || row.id || '—',
    type: row.permit_type || row.work_type || 'General construction',
    status: row.permit_status || row.status || 'issued',
    description:
      row.work_description || row.reported_cost_description || row.permit_type || 'Building permit',
    address,
    issuedDate: row.issue_date || row.application_start_date || null,
    cost: Number(row.reported_cost || row.estimated_cost || 0) || null,
    lat: Number(row.latitude) || null,
    lng: Number(row.longitude) || null,
  };
};

// Realistic fallback so the page works offline or when the dataset is down.
const SAMPLE = [
  {
    id: 'sample-1',
    number: 'BR-2022-104872',
    type: 'New construction',
    status: 'issued',
    description: 'Six-storey mixed-use residential and retail building',
    address: '142 Sir John Rogerson’s Quay, Dublin 2',
    issuedDate: '2022-03-14',
    cost: 4250000,
    lat: 53.3441,
    lng: -6.2386,
  },
  {
    id: 'sample-2',
    number: 'BR-2022-104915',
    type: 'Renovation',
    status: 'under review',
    description: 'Heritage façade restoration and interior fit-out',
    address: '8 South William Street, Dublin 2',
    issuedDate: '2022-02-28',
    cost: 980000,
    lat: 53.3419,
    lng: -6.262,
  },
  {
    id: 'sample-3',
    number: 'BR-2022-105003',
    type: 'Commercial',
    status: 'issued',
    description: 'Two-storey logistics warehouse with office mezzanine',
    address: 'Unit 4, Ballymount Industrial Estate, Dublin 12',
    issuedDate: '2022-04-02',
    cost: 2100000,
    lat: 53.3097,
    lng: -6.3441,
  },
  {
    id: 'sample-4',
    number: 'BR-2022-105140',
    type: 'Residential',
    status: 'issued',
    description: 'Detached four-bedroom A-rated family home',
    address: '17 Seapoint Avenue, Blackrock, Co. Dublin',
    issuedDate: '2022-04-21',
    cost: 615000,
    lat: 53.2986,
    lng: -6.1789,
  },
  {
    id: 'sample-5',
    number: 'BR-2022-105288',
    type: 'Industrial',
    status: 'under review',
    description: 'Steel-frame manufacturing facility, phase 1',
    address: 'IDA Business Park, Swords, Co. Dublin',
    issuedDate: '2022-05-09',
    cost: 5400000,
    lat: 53.4597,
    lng: -6.2181,
  },
  {
    id: 'sample-6',
    number: 'BR-2022-105331',
    type: 'Renovation',
    status: 'issued',
    description: 'Office floor refurbishment and accessibility upgrade',
    address: '23 Fitzwilliam Square, Dublin 2',
    issuedDate: '2022-05-18',
    cost: 340000,
    lat: 53.3354,
    lng: -6.2497,
  },
];

const getPermits = async ({ limit = 24, q = '' } = {}) => {
  const key = `permits:${limit}:${q}`;
  const cached = cache.get(key);
  if (cached) return { source: 'cache', items: cached };

  try {
    const params = { $limit: limit, $order: 'issue_date DESC' };
    if (q) params.$q = q;

    const headers = {};
    if (process.env.SOCRATA_APP_TOKEN) headers['X-App-Token'] = process.env.SOCRATA_APP_TOKEN;

    const { data } = await axios.get(BASE_URL, { params, headers, timeout: 8000 });
    const items = Array.isArray(data) ? data.map(normalize) : [];
    const result = items.length ? items : SAMPLE;

    cache.set(key, result);
    return { source: 'live', items: result };
  } catch (err) {
    // Cache the fallback briefly so a flaky upstream doesn't get retried on every request.
    cache.set(key, SAMPLE, 60);
    return { source: 'fallback', items: SAMPLE, error: err.message };
  }
};

const clearCache = () => cache.flushAll();

module.exports = { getPermits, clearCache };
