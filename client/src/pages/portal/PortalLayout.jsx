import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const T = {
  fontMono: 'var(--font-accent)',
  fontDisplay: 'var(--font-heading)',
  fontBody: 'var(--font-primary)',
  muted: 'var(--text-muted)',
  text: 'var(--text-color)',
  bg: 'var(--bg-color)',
  red: '#C1121F',
  border: 'rgba(255,255,255,0.08)',
};

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return; }
  }, [user, navigate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!user) return null;

  const emailName = user.email ? user.email.split('@')[0] : 'U';
  const initials = emailName.slice(0, 2).toUpperCase();

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: T.fontBody }}>

      {/* ── Top nav ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.5rem 5vw',
        zIndex: 30,
        background: scrolled ? 'rgba(0,0,0,0.82)' : 'transparent',
        borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}>

        {/* Brand */}
        <div style={{ fontFamily: T.fontMono, fontSize: '0.82rem', letterSpacing: '0.25em', textTransform: 'lowercase', color: T.muted }}>
          codecell <span style={{ color: T.red }}>portal</span>
        </div>

        {/* Pill nav */}
        <nav style={{
          display: 'inline-flex', gap: '0.75rem',
          background: 'rgba(255,255,255,0.06)',
          border: `1px solid ${T.border}`,
          borderRadius: '999px',
          padding: '0.45rem 0.55rem',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}>
          {[
            { to: '/portal', label: '.submit', end: true },
            { to: '/portal/submissions', label: '.my work', end: false },
            ...(user.role === 'admin' ? [{ to: '/admin', label: '.admin dashboard', end: false }] : []),
            { to: '/', label: '.back to site', end: false },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                color: isActive ? T.text : T.muted,
                background: isActive ? 'rgba(193,18,31,0.18)' : 'transparent',
                padding: '0.6rem 1.1rem',
                borderRadius: '999px',
                fontSize: '0.88rem',
                fontFamily: T.fontMono,
                transition: 'color 0.25s, background 0.25s',
                textDecoration: 'none',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side — avatar + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Avatar */}
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '50%',
            background: 'rgba(193,18,31,0.2)',
            border: `1px solid rgba(193,18,31,0.4)`,
            display: 'grid', placeItems: 'center',
            fontFamily: T.fontMono, fontSize: '0.62rem', letterSpacing: '0.05em',
            color: T.red,
          }}>
            {initials}
          </div>
          {/* Logout */}
          <button
            id="portal-logout"
            onClick={() => { logout(); navigate('/login'); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: T.muted, fontFamily: T.fontMono, fontSize: '0.62rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              transition: 'color 0.2s', padding: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = T.text}
            onMouseLeave={e => e.currentTarget.style.color = T.muted}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, paddingTop: '5rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
