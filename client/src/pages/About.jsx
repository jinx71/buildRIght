import React from 'react';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';

const VALUES = [
  {
    title: 'Safety first, always',
    desc: 'Zero lost-time incidents in 2022 across nine concurrent sites. Daily toolbox talks; weekly audits.',
  },
  {
    title: 'Programme discipline',
    desc: 'We build to a Last-Planner programme and publish a weekly look-ahead to every stakeholder.',
  },
  {
    title: 'Transparent pricing',
    desc: 'Open-book on tenders over €1M. You see the rates, the prelims and the contingency.',
  },
  {
    title: 'Quality without ceremony',
    desc: 'Snag-free handovers are the floor. Defects-liability response inside 48 hours.',
  },
];

const TEAM = [
  { name: 'Eoin Brennan', role: 'Managing Director', initials: 'EB' },
  { name: 'Niamh O’Halloran', role: 'Construction Director', initials: 'NO' },
  { name: 'Senan Walsh', role: 'Commercial Director', initials: 'SW' },
  { name: 'Aoife Costello', role: 'Head of Safety', initials: 'AC' },
];

const About = () => (
  <>
    <section className="bg-slate-50 bg-blueprint bg-grid">
      <div className="container-px py-16 md:py-20">
        <span className="eyebrow">
          <span className="h-px w-6 bg-brand-500" aria-hidden="true" />
          About BuildRight
        </span>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
          A Dublin contractor that takes the boring parts of building seriously.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-600">
          We were founded in 2007 by two site engineers tired of watching good design get
          compromised on the way to handover. Eighteen years on, we’re a 110-person firm that
          still runs every project the same way: a single integrated team, a published programme,
          and a director on every site visit.
        </p>
      </div>
    </section>

    <section className="container-px py-20">
      <SectionHeading
        eyebrow="What we believe"
        title="Four values, applied weekly"
        subtitle="These aren’t posters in the canteen — they’re what we audit ourselves against."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {VALUES.map((v, i) => (
          <Card key={v.title} className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
              0{i + 1}
            </p>
            <h3 className="mt-3 text-xl font-semibold">{v.title}</h3>
            <p className="mt-2 leading-relaxed text-slate-600">{v.desc}</p>
          </Card>
        ))}
      </div>
    </section>

    <section className="bg-slate-50">
      <div className="container-px py-20">
        <SectionHeading eyebrow="Leadership" title="The directors behind the programme" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <Card key={m.name} className="p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
                {m.initials}
              </div>
              <h3 className="mt-4 font-semibold">{m.name}</h3>
              <p className="text-sm text-slate-500">{m.role}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default About;
