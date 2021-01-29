import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Input } from '../components/Input';
import SectionHeading from '../components/SectionHeading';
import { EmptyState, ErrorState } from '../components/EmptyState';
import { getPermits } from '../api/endpoints';
import { getErrorMessage } from '../api/axios';
import { formatCurrency, formatDate } from '../utils/format';

/**
 * ENGINEERING LESSON (client side):
 * The page never talks to the third-party permits API directly. It calls our
 * /api/permits route, which proxies + caches the external dataset behind
 * node-cache. That keeps API tokens off the browser, normalizes the messy
 * upstream shape, and absorbs reloads without burning rate limit.
 */

const statusTone = (s = '') => {
  const t = s.toLowerCase();
  if (t.includes('issue')) return 'green';
  if (t.includes('review')) return 'amber';
  if (t.includes('reject') || t.includes('withdraw')) return 'red';
  return 'slate';
};

const Permits = () => {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [permits, setPermits] = useState([]);
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const load = async (q = '') => {
    setStatus('loading');
    setError('');
    try {
      const data = await getPermits({ q, limit: 24 });
      setPermits(data.permits || []);
      setSource(data.source || '');
      setStatus('ready');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load permit activity.'));
      setStatus('error');
    }
  };

  useEffect(() => {
    load(submitted);
  }, [submitted]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmitted(query.trim());
  };

  return (
    <>
      <section className="bg-slate-50 bg-blueprint bg-grid">
        <div className="container-px py-16 md:py-20">
          <SectionHeading
            eyebrow="Live data · proxied + cached"
            title="Building-permit activity in the wild"
            subtitle="A live feed of recent building permits, pulled through our backend and cached for 10 minutes so the page is fast and the upstream stays happy."
          />

          <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                id="permit-search"
                placeholder="Search by description (e.g. residential, renovation)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg">Search</Button>
            {submitted && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setQuery('');
                  setSubmitted('');
                }}
              >
                Clear
              </Button>
            )}
          </form>

          {source && (
            <p className="mt-4 text-xs text-slate-500">
              Source: <span className="font-semibold uppercase tracking-wider">{source}</span>
              {source === 'fallback' && ' — showing sample data because the upstream dataset was unreachable.'}
              {source === 'cache' && ' — served from our backend cache.'}
              {source === 'live' && ' — fresh from the upstream dataset.'}
            </p>
          )}
        </div>
      </section>

      <section className="container-px py-12">
        {status === 'loading' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-44" />
            ))}
          </div>
        )}

        {status === 'error' && <ErrorState message={error} onRetry={() => load(submitted)} />}

        {status === 'ready' && permits.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No permits matched"
            message="Try a different keyword, or clear the search to see the most recent activity."
          />
        )}

        {status === 'ready' && permits.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {permits.map((p) => (
              <Card key={p.id} hover className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-slate-500">
                      {p.number}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-slate-900">{p.type}</h3>
                  </div>
                  <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {p.description}
                </p>
                <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <p className="truncate">{p.address}</p>
                  <p className="mt-1 flex justify-between">
                    <span>{formatDate(p.issuedDate)}</span>
                    {p.cost ? <span className="font-semibold text-slate-700">{formatCurrency(p.cost)}</span> : null}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Permits;
