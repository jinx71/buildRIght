import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/permits', label: 'Permits' },
  { to: '/estimator', label: 'Estimator' },
  { to: '/about', label: 'About' },
];

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="container-px flex h-16 items-center justify-between">
        <Link to="/" aria-label="BuildRight home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <Button as={Link} to="/admin" variant="outline" size="sm">
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sign out
              </Button>
            </>
          ) : (
            <Button as={Link} to="/login" variant="ghost" size="sm">
              Admin
            </Button>
          )}
          <Button as={Link} to="/contact" size="sm">
            Get a quote
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-px flex flex-col gap-1 py-3">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              {isAuthenticated ? (
                <>
                  <Button as={Link} to="/admin" variant="outline" size="sm" onClick={() => setOpen(false)}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Sign out
                  </Button>
                </>
              ) : (
                <Button as={Link} to="/login" variant="outline" size="sm" onClick={() => setOpen(false)}>
                  Admin sign in
                </Button>
              )}
              <Button as={Link} to="/contact" size="sm" onClick={() => setOpen(false)}>
                Get a quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
