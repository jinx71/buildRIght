import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => (
  <footer className="mt-20 bg-slate-900 bg-blueprint bg-grid text-slate-300">
    <div className="container-px grid gap-10 py-14 md:grid-cols-4">
      <div className="md:col-span-2">
        <Logo light />
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
          Design-led construction and civil engineering across Dublin and the Greater Dublin Area.
          Residential, commercial, industrial and renovation — delivered on time, built right.
        </p>
      </div>

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
        <ul className="mt-4 space-y-2 text-sm">
          <li><Link to="/services" className="hover:text-brand-400">Services</Link></li>
          <li><Link to="/projects" className="hover:text-brand-400">Projects</Link></li>
          <li><Link to="/estimator" className="hover:text-brand-400">Cost estimator</Link></li>
          <li><Link to="/permits" className="hover:text-brand-400">Permit activity</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
        <ul className="mt-4 space-y-2 text-sm text-slate-400">
          <li>Unit 12, Docklands Innovation Park</li>
          <li>East Wall Road, Dublin 3</li>
          <li><a href="mailto:hello@buildright.dev" className="hover:text-brand-400">hello@buildright.dev</a></li>
          <li><a href="tel:+35315551234" className="hover:text-brand-400">+353 1 555 1234</a></li>
        </ul>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="container-px flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
        <span>© {new Date().getFullYear()} BuildRight Construction Ltd. All rights reserved.</span>
        <span>RIAI &amp; CIF registered · Fully insured</span>
      </div>
    </div>
  </footer>
);

export default Footer;
