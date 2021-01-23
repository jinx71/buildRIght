import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import Spinner from '../components/Spinner';
import { EmptyState, ErrorState } from '../components/EmptyState';
import { getQuotes, updateQuoteStatus, deleteQuote } from '../api/endpoints';
import { getErrorMessage } from '../api/axios';
import { formatCurrency, formatDate } from '../utils/format';
import { useAuth } from '../hooks/useAuth';

const STATUS_OPTIONS = ['new', 'reviewed', 'won', 'lost'];

const statusTone = (s) => {
  switch (s) {
    case 'new': return 'amber';
    case 'reviewed': return 'blue';
    case 'won': return 'green';
    case 'lost': return 'red';
    default: return 'slate';
  }
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [filter, setFilter] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setStatus('loading');
    setError('');
    try {
      const data = await getQuotes(filter);
      setQuotes(data);
      setStatus('ready');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load quote requests.'));
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const stats = useMemo(() => {
    const counts = { new: 0, reviewed: 0, won: 0, lost: 0 };
    quotes.forEach((q) => {
      if (counts[q.status] != null) counts[q.status] += 1;
    });
    return counts;
  }, [quotes]);

  const handleStatusChange = async (id, newStatus) => {
    setBusyId(id);
    try {
      const updated = await updateQuoteStatus(id, newStatus);
      setQuotes((prev) => prev.map((q) => (q._id === id ? updated : q)));
      toast.success('Status updated');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update status'));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (!window.confirm('Delete this quote request? This can’t be undone.')) return;
    setBusyId(id);
    try {
      await deleteQuote(id);
      setQuotes((prev) => prev.filter((q) => q._id !== id));
      toast.success('Quote deleted');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete that quote'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="container-px py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow={user ? `Signed in as ${user.name}` : 'Admin'}
          title="Quote requests"
          subtitle="Every submission from the contact form lands here. Update status to keep the pipeline tidy."
        />
        <Button variant="outline" onClick={load} disabled={status === 'loading'}>
          Refresh
        </Button>
      </div>

      {/* Stat tiles */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATUS_OPTIONS.map((s) => (
          <Card key={s} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s}</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-slate-900">{stats[s]}</p>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter('')}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
            filter === '' ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400'
          }`}
          aria-pressed={filter === ''}
        >
          All
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize ${
              filter === s ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400'
            }`}
            aria-pressed={filter === s}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-6">
        {status === 'loading' && (
          <div className="flex justify-center py-16">
            <Spinner size="lg" label="Loading quote requests" />
          </div>
        )}

        {status === 'error' && <ErrorState message={error} onRetry={load} />}

        {status === 'ready' && quotes.length === 0 && (
          <EmptyState
            icon="📭"
            title="No quote requests yet"
            message="When someone submits the contact form, it’ll appear here."
          />
        )}

        {status === 'ready' && quotes.length > 0 && (
          <div className="space-y-4">
            {quotes.map((q) => (
              <Card key={q._id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">{q.name}</h3>
                      <Badge tone={statusTone(q.status)}>{q.status}</Badge>
                      <Badge tone="slate">{q.projectType}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      <a href={`mailto:${q.email}`} className="hover:text-brand-700">{q.email}</a>
                      {q.phone && <> · {q.phone}</>}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">{formatDate(q.createdAt)}</p>
                </div>

                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Budget</p>
                    <p className="font-medium text-slate-800">{q.budget ? formatCurrency(q.budget) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Area</p>
                    <p className="font-medium text-slate-800">{q.squareMeters ? `${q.squareMeters} m²` : '—'}</p>
                  </div>
                </div>

                {q.message && (
                  <p className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                    {q.message}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.filter((s) => s !== q.status).map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant="outline"
                        disabled={busyId === q._id}
                        onClick={() => handleStatusChange(q._id, s)}
                      >
                        Mark {s}
                      </Button>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={busyId === q._id}
                    onClick={() => handleDelete(q._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
