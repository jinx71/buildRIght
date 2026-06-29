import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { formatCurrency } from '../utils/format';

// Indicative €/m² ranges for Ireland circa 2022 — clearly labelled as estimates.
const RATES = {
  residential: { standard: 1900, mid: 2400, premium: 3200 },
  commercial: { standard: 1700, mid: 2200, premium: 2900 },
  industrial: { standard: 950, mid: 1300, premium: 1800 },
  renovation: { standard: 1400, mid: 1900, premium: 2700 },
};

const FINISH_LABELS = {
  standard: 'Standard',
  mid: 'Mid-range',
  premium: 'Premium',
};

// Adjustments are multiplicative — kept small and conservative.
const LOCATION_FACTOR = { dublin: 1.0, commuter: 0.92, regional: 0.85 };
const COMPLEXITY_FACTOR = { simple: 0.95, typical: 1.0, complex: 1.15 };

const Estimator = () => {
  const [area, setArea] = useState(150);
  const [projectType, setProjectType] = useState('residential');
  const [finish, setFinish] = useState('mid');
  const [location, setLocation] = useState('dublin');
  const [complexity, setComplexity] = useState('typical');

  const result = useMemo(() => {
    const ratePerM2 = RATES[projectType][finish];
    const base = area * ratePerM2;
    const adjusted = base * LOCATION_FACTOR[location] * COMPLEXITY_FACTOR[complexity];
    const low = Math.round((adjusted * 0.9) / 1000) * 1000;
    const high = Math.round((adjusted * 1.1) / 1000) * 1000;
    return { ratePerM2, low, high };
  }, [area, projectType, finish, location, complexity]);

  return (
    <>
      <section className="bg-slate-50 bg-blueprint bg-grid">
        <div className="container-px py-16 md:py-20">
          <SectionHeading
            eyebrow="Cost estimator"
            title="Get an indicative cost range in 30 seconds"
            subtitle="A directional figure for early-stage planning. For an itemised tender, we’ll need a measured drawing and a brief — get in touch."
          />
        </div>
      </section>

      <section className="container-px py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Inputs */}
          <Card className="p-6 lg:col-span-3">
            <h2 className="text-xl font-semibold">Your project</h2>
            <p className="mt-1 text-sm text-slate-500">All figures exclude VAT and statutory fees.</p>

            <div className="mt-6 space-y-6">
              {/* Project type */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Project type</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Object.keys(RATES).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setProjectType(key)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                        projectType === key
                          ? 'border-brand-500 bg-brand-50 text-brand-800'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400'
                      }`}
                      aria-pressed={projectType === key}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish level */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Finish level</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {Object.keys(FINISH_LABELS).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFinish(key)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                        finish === key
                          ? 'border-brand-500 bg-brand-50 text-brand-800'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400'
                      }`}
                      aria-pressed={finish === key}
                    >
                      {FINISH_LABELS[key]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div>
                <label htmlFor="area" className="flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>Floor area</span>
                  <span className="font-semibold text-brand-700">{area} m²</span>
                </label>
                <input
                  id="area"
                  type="range"
                  min="20"
                  max="2000"
                  step="10"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="mt-3 w-full accent-brand-500"
                />
                <div className="mt-1 flex justify-between text-xs text-slate-500">
                  <span>20 m²</span>
                  <span>2,000 m²</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Location</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { k: 'dublin', l: 'Dublin' },
                    { k: 'commuter', l: 'Commuter belt' },
                    { k: 'regional', l: 'Regional' },
                  ].map((o) => (
                    <button
                      key={o.k}
                      type="button"
                      onClick={() => setLocation(o.k)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                        location === o.k
                          ? 'border-brand-500 bg-brand-50 text-brand-800'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400'
                      }`}
                      aria-pressed={location === o.k}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complexity */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Complexity</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { k: 'simple', l: 'Simple' },
                    { k: 'typical', l: 'Typical' },
                    { k: 'complex', l: 'Complex' },
                  ].map((o) => (
                    <button
                      key={o.k}
                      type="button"
                      onClick={() => setComplexity(o.k)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                        complexity === o.k
                          ? 'border-brand-500 bg-brand-50 text-brand-800'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400'
                      }`}
                      aria-pressed={complexity === o.k}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Result */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24 p-6">
              <Badge tone="brand">Indicative</Badge>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900">
                {formatCurrency(result.low)}
                <span className="mx-2 text-slate-400">–</span>
                {formatCurrency(result.high)}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Range based on {formatCurrency(result.ratePerM2)} / m² for{' '}
                <strong className="font-semibold text-slate-700">{FINISH_LABELS[finish].toLowerCase()}</strong>{' '}
                {projectType}.
              </p>

              <dl className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Area</dt>
                  <dd className="font-medium text-slate-800">{area} m²</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Location</dt>
                  <dd className="font-medium capitalize text-slate-800">{location.replace('-', ' ')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Complexity</dt>
                  <dd className="font-medium capitalize text-slate-800">{complexity}</dd>
                </div>
              </dl>

              <Button as={Link} to="/contact" className="mt-6 w-full">
                Continue to a quote
              </Button>

              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Estimates exclude VAT, professional fees, statutory contributions and abnormals.
                For a formal tender we’ll need drawings and a brief — about a week’s turnaround.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default Estimator;
