import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import SectionHeading from '../components/SectionHeading';
import Spinner from '../components/Spinner';
import { ErrorState, EmptyState } from '../components/EmptyState';
import { getProjects } from '../api/endpoints';
import { getErrorMessage } from '../api/axios';

const STATS = [
  { value: '18+', label: 'Years building in Dublin' },
  { value: '240', label: 'Projects delivered' },
  { value: '€420M', label: 'Construction value' },
  { value: '0', label: 'Lost-time incidents in 2022' },
];

const SERVICES = [
  {
    title: 'Residential',
    desc: 'New-build family homes, infill terraces and energy-efficient retrofits.',
    icon: '🏡',
  },
  {
    title: 'Commercial',
    desc: 'Offices, retail fit-outs and mixed-use developments delivered on fast-track programmes.',
    icon: '🏢',
  },
  {
    title: 'Industrial',
    desc: 'Steel-frame warehouses, manufacturing facilities and logistics hubs.',
    icon: '🏭',
  },
  {
    title: 'Renovation',
    desc: 'Heritage façade restoration, full refurbishments and accessibility upgrades.',
    icon: '🛠️',
  },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');

  const load = async () => {
    setStatus('loading');
    setError('');
    try {
      const projects = await getProjects('all');
      setFeatured(projects.filter((p) => p.featured).slice(0, 3));
      setStatus('ready');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load featured projects.'));
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-50 bg-blueprint bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/0 to-white" aria-hidden="true" />
        <div className="container-px relative grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <span className="eyebrow">
              <span className="h-px w-6 bg-brand-500" aria-hidden="true" />
              Construction · Civil engineering · Dublin
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-slate-900 sm:text-5xl md:text-6xl">
              Built right.
              <br />
              <span className="text-brand-600">On time. On budget.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              BuildRight is a Dublin-based contractor delivering residential, commercial and
              industrial projects across the Greater Dublin Area. Eighteen years of careful
              programming, transparent pricing and zero compromises on safety.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/contact" size="lg">
                Request a quote
              </Button>
              <Button as={Link} to="/projects" variant="outline" size="lg">
                See our work
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{s.value}</dt>
                  <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Signature: a small annotated "site plan" card */}
          <div className="md:col-span-5">
            <div className="relative animate-fade-up">
              <div className="absolute -inset-3 rounded-3xl bg-brand-500/10" aria-hidden="true" />
              <Card className="relative overflow-hidden p-0">
                <div className="aspect-[4/5] w-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80')",
                  }}
                />
                <div className="border-t border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                    Current site
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-slate-900">
                    Quayside Mixed-Use, Dublin 2
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Phase 03 of 05 · Handover Q4 2022
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────── */}
      <section className="container-px py-20">
        <SectionHeading
          eyebrow="What we do"
          title="Four disciplines, one delivery team"
          subtitle="Every project runs from a single integrated team — design coordination, programme, procurement and on-site delivery."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <Card key={s.title} hover className="p-6">
              <div className="text-3xl" aria-hidden="true">
                {s.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Featured projects (live from the API) ── */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
                <span className="h-px w-6 bg-brand-400" aria-hidden="true" />
                Selected work
              </span>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Recent featured projects</h2>
            </div>
            <Button as={Link} to="/projects" variant="outline" className="bg-white">
              View all projects
            </Button>
          </div>

          <div className="mt-10">
            {status === 'loading' && (
              <div className="grid gap-5 md:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="skeleton h-72" />
                ))}
              </div>
            )}
            {status === 'error' && <ErrorState message={error} onRetry={load} />}
            {status === 'ready' && featured.length === 0 && (
              <EmptyState
                icon="🏗️"
                title="No featured projects yet"
                message="Run `npm run seed` from the server folder to populate the portfolio."
              />
            )}
            {status === 'ready' && featured.length > 0 && (
              <div className="grid gap-5 md:grid-cols-3">
                {featured.map((p) => (
                  <Card key={p._id} className="overflow-hidden bg-slate-800 ring-1 ring-white/5" hover>
                    <div
                      className="aspect-[4/3] w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${p.image})` }}
                    />
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
                        {p.category} · {p.year}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{p.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{p.location}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────── */}
      <section className="container-px py-20">
        <Card className="overflow-hidden p-0">
          <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Starting a project this year?</h2>
              <p className="mt-3 text-slate-600">
                Send us a brief — we’ll come back within two business days with an indicative
                programme, a square-metre cost range, and the next steps.
              </p>
            </div>
            <div className="flex flex-wrap justify-start gap-3 md:justify-end">
              <Button as={Link} to="/estimator" variant="outline" size="lg">
                Try the cost estimator
              </Button>
              <Button as={Link} to="/contact" size="lg">
                Request a quote
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Home;
