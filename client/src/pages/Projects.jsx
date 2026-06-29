import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import SectionHeading from '../components/SectionHeading';
import { EmptyState, ErrorState } from '../components/EmptyState';
import { getProjects } from '../api/endpoints';
import { getErrorMessage } from '../api/axios';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'residential', label: 'Residential' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'industrial', label: 'Industrial' },
  { key: 'renovation', label: 'Renovation' },
];

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const load = async (category) => {
    setStatus('loading');
    setError('');
    try {
      const data = await getProjects(category);
      setProjects(data);
      setStatus('ready');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load projects.'));
      setStatus('error');
    }
  };

  useEffect(() => {
    load(filter);
  }, [filter]);

  return (
    <>
      <section className="bg-slate-50 bg-blueprint bg-grid">
        <div className="container-px py-16 md:py-20">
          <SectionHeading
            eyebrow="Portfolio"
            title="Projects we’ve delivered"
            subtitle="Filter by sector. Tap any card for the headline numbers and a short case study."
          />
        </div>
      </section>

      <section className="container-px py-12">
        {/* Filter tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700'
                }`}
                aria-pressed={active}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* States */}
        {status === 'loading' && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-72" />
            ))}
          </div>
        )}

        {status === 'error' && <ErrorState message={error} onRetry={() => load(filter)} />}

        {status === 'ready' && projects.length === 0 && (
          <EmptyState
            icon="🏗️"
            title="No projects in this category yet"
            message="Try another filter, or seed the database from the server folder (`npm run seed`)."
          />
        )}

        {status === 'ready' && projects.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Card key={p._id} hover className="overflow-hidden p-0">
                <div
                  className="aspect-[4/3] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${p.image})` }}
                />
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="brand">{p.category}</Badge>
                    {p.year && <Badge tone="slate">{p.year}</Badge>}
                    {p.featured && <Badge tone="amber">Featured</Badge>}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                  {p.location && <p className="mt-1 text-sm text-slate-500">{p.location}</p>}
                  {p.description && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.description}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Projects;
