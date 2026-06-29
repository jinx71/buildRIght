import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';
import Button from '../components/Button';

const SERVICES = [
  {
    title: 'Residential',
    icon: '🏡',
    blurb: 'A-rated family homes, infill terraces, energy-efficient retrofits and bespoke private clients.',
    bullets: ['One-off houses', 'Multi-unit developments', 'Deep retrofit & extensions', 'Heritage-grade renovations'],
  },
  {
    title: 'Commercial',
    icon: '🏢',
    blurb: 'Offices, retail fit-outs and mixed-use buildings on fast-track programmes for tenants and developers.',
    bullets: ['Cat-A & Cat-B fit-outs', 'Mixed-use shells & cores', 'Hospitality & food-and-beverage', 'Working-while-occupied refurbishment'],
  },
  {
    title: 'Industrial',
    icon: '🏭',
    blurb: 'Steel-frame warehouses, manufacturing facilities and logistics hubs across the Greater Dublin Area.',
    bullets: ['Pharma & life-sciences', 'Logistics & distribution', 'Data centre civils', 'Cleanroom & specialist fit-out'],
  },
  {
    title: 'Renovation',
    icon: '🛠️',
    blurb: 'Heritage façade restoration, full refurbishments and accessibility upgrades for live buildings.',
    bullets: ['Listed-building works', 'BER upgrades', 'Accessibility compliance', 'Asbestos & remediation'],
  },
];

const PROCESS = [
  { n: '01', title: 'Brief', desc: 'A scoping conversation and site visit — we listen first.' },
  { n: '02', title: 'Indicative cost', desc: 'A square-metre cost range and an outline programme within 5 working days.' },
  { n: '03', title: 'Design coordination', desc: 'We sit in with your design team to lock buildability and procurement.' },
  { n: '04', title: 'Build', desc: 'Weekly look-ahead, monthly valuation, fortnightly site walk with you.' },
  { n: '05', title: 'Handover', desc: 'Snag-free handover, full O&M pack, and a 12-month defects response window.' },
];

const Services = () => (
  <>
    <section className="bg-slate-50 bg-blueprint bg-grid">
      <div className="container-px py-16 md:py-20">
        <span className="eyebrow">
          <span className="h-px w-6 bg-brand-500" aria-hidden="true" />
          Services
        </span>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
          Four disciplines. One integrated delivery team.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-600">
          Whatever the sector, the people are the same: a director, a contracts manager,
          a site agent and a quantity surveyor — assigned at award and there at handover.
        </p>
      </div>
    </section>

    <section className="container-px py-20">
      <div className="grid gap-5 md:grid-cols-2">
        {SERVICES.map((s) => (
          <Card key={s.title} className="p-6">
            <div className="flex items-start justify-between">
              <div className="text-3xl" aria-hidden="true">{s.icon}</div>
            </div>
            <h2 className="mt-4 text-2xl font-semibold">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-slate-600">{s.blurb}</p>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>

    {/* Process — numbered markers here are appropriate because order matters. */}
    <section className="bg-slate-900 py-20 text-white">
      <div className="container-px">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
          <span className="h-px w-6 bg-brand-400" aria-hidden="true" />
          How we work
        </span>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">From first call to defects-free handover.</h2>

        <ol className="mt-12 grid gap-6 md:grid-cols-5">
          {PROCESS.map((p) => (
            <li key={p.n} className="rounded-xl border border-white/10 bg-slate-800/40 p-5">
              <p className="font-display text-3xl font-extrabold text-brand-400">{p.n}</p>
              <h3 className="mt-3 text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{p.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button as={Link} to="/contact" size="lg">Start a brief</Button>
          <Button as={Link} to="/estimator" variant="outline" size="lg" className="bg-white">
            Estimate cost
          </Button>
        </div>
      </div>
    </section>
  </>
);

export default Services;
