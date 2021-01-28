import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => (
  <section className="container-px flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
    <p className="font-display text-7xl font-extrabold text-brand-500">404</p>
    <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
    <p className="mt-2 max-w-md text-slate-600">
      That URL didn’t match any of our pages. Try the homepage, or have a look at our recent projects.
    </p>
    <div className="mt-6 flex gap-3">
      <Button as={Link} to="/">Back home</Button>
      <Button as={Link} to="/projects" variant="outline">See projects</Button>
    </div>
  </section>
);

export default NotFound;
