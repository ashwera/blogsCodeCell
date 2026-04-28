import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { apiFetch } from '../../lib/api';

const T = {
  fontMono: 'var(--font-accent)',
  fontDisplay: 'var(--font-heading)',
  fontBody: 'var(--font-primary)',
  muted: 'var(--text-muted)',
  text: 'var(--text-color)',
  bg: 'var(--bg-color)',
  red: '#C1121F',
  border: 'rgba(255,255,255,0.08)',
  slabBg: 'rgba(255,255,255,0.025)',
};

/* ── Real API fetch approach replaces Mock. ── */

const STATUS_CONFIG = {
  pending:   { label: 'Pending Review', color: T.red,                  borderColor: 'rgba(193,18,31,0.4)', bg: 'rgba(193,18,31,0.08)' },
  published: { label: 'Published',      color: 'rgba(255,255,255,0.6)', borderColor: T.border,              bg: 'rgba(255,255,255,0.04)' },
  rejected:  { label: 'Needs Revision', color: '#888',                  borderColor: 'rgba(255,255,255,0.1)',bg: 'rgba(255,255,255,0.02)' },
};

function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      fontFamily: T.fontMono, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
      color: cfg.color, border: `1px solid ${cfg.borderColor}`, background: cfg.bg,
      borderRadius: '999px', padding: '0.3rem 0.9rem', flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

export default function PortalSubmissions() {
  const { user } = useAuth();
  const [subs, setSubs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSubs = async () => {
      try {
        const data = await apiFetch('/blogs/mine');
        setSubs(data);
      } catch (err) {
        console.error('Failed to fetch subs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  const counts = {
    total:     subs.length,
    pending:   subs.filter(s => s.status === 'pending').length,
    published: subs.filter(s => s.status === 'published').length,
    rejected:  subs.filter(s => s.status === 'rejected').length,
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 5rem)', padding: 'clamp(2rem, 5vw, 4rem) 5vw 8rem', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ── */}
      <header style={{ marginBottom: '0.5rem' }}>
        <p style={{ fontFamily: T.fontMono, fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.75rem' }}>
          Portal · {user?.name}
        </p>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(3.5rem, 6vw, 8rem)', lineHeight: 0.94, letterSpacing: '-0.04em', margin: 0, color: T.text }}>
          My Work
        </h1>
      </header>

      {/* ── Back to site button ── */}
      <div style={{ marginBottom: '2rem' }}>
        <NavLink
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.6rem 1.2rem',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${T.border}`,
            borderRadius: '999px',
            color: T.muted,
            fontFamily: T.fontMono,
            fontSize: '0.72rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'all 0.25s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.color = T.text;
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = T.border;
            e.currentTarget.style.color = T.muted;
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          }}
        >
          ← back to site
        </NavLink>
      </div>

      {/* ── Stats slab ── */}
      <div style={{ border: `1px solid ${T.border}`, background: T.slabBg, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        {[
          { label: 'Total', value: counts.total,     red: false },
          { label: 'Pending', value: counts.pending, red: counts.pending > 0 },
          { label: 'Published', value: counts.published, red: false },
          { label: 'Needs Revision', value: counts.rejected, red: false },
        ].map(({ label, value, red }, i) => (
          <div key={label} style={{
            padding: '1.5rem 2rem',
            borderRight: '1px solid transparent',
            borderInlineEnd: i < 3 ? `1px solid ${T.border}` : 'none',
            display: 'flex', flexDirection: 'column', gap: '0.3rem',
          }}>
            <span style={{ fontFamily: T.fontMono, fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: T.muted }}>{label}</span>
            <span style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(2rem, 3vw, 3rem)', lineHeight: 1, color: red ? T.red : T.text }}>{value}</span>
          </div>
        ))}
      </div>

      {/* ── Submissions list ── */}
      {subs.length === 0 ? (
        <div style={{ border: `1px solid ${T.border}`, background: T.slabBg, padding: '4rem', textAlign: 'center' }}>
          <p style={{ fontFamily: T.fontMono, fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted }}>
            No submissions yet. Start writing.
          </p>
        </div>
      ) : (
        <div style={{ border: `1px solid ${T.border}`, background: T.slabBg }}>
          {/* Slab header */}
          <div style={{ padding: '1.25rem 2rem', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: T.muted, margin: 0 }}>
              Submission Log
            </p>
            <span style={{ fontFamily: T.fontMono, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted }}>
              {counts.total} total
            </span>
          </div>

          {subs.map((sub, i) => (
            <div
              key={sub._id}
              style={{
                padding: '1.75rem 2rem',
                borderBottom: i < subs.length - 1 ? `1px solid ${T.border}` : 'none',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Left — content */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Category + date */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: T.fontMono, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.red }}>
                    {sub.category}
                  </span>
                  <span style={{ fontFamily: T.fontMono, fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                <h2 style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(1.15rem, 2vw, 1.65rem)', lineHeight: 1.2, margin: 0, color: T.text }}>
                  {sub.title}
                </h2>

                {/* Excerpt */}
                <p style={{ fontFamily: T.fontBody, fontSize: '0.88rem', lineHeight: 1.65, color: T.muted, margin: 0, maxWidth: '70ch' }}>
                  {sub.excerpt}
                </p>

                {/* Tags */}
                {sub.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {sub.tags.map(tag => (
                      <span key={tag} style={{
                        fontFamily: T.fontMono, fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.3)', border: `1px solid rgba(255,255,255,0.07)`,
                        borderRadius: '999px', padding: '0.2rem 0.6rem',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Admin note (only on rejected) */}
                {sub.status === 'rejected' && sub.adminNote && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.85rem 1.1rem',
                    border: `1px solid rgba(255,255,255,0.07)`,
                    background: 'rgba(255,255,255,0.02)',
                    borderLeft: `2px solid rgba(255,255,255,0.15)`,
                  }}>
                    <p style={{ fontFamily: T.fontMono, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.35rem' }}>
                      Editorial note
                    </p>
                    <p style={{ fontFamily: T.fontBody, fontSize: '0.84rem', color: T.muted, lineHeight: 1.6, margin: 0 }}>
                      {sub.adminNote}
                    </p>
                  </div>
                )}
              </div>

              {/* Right — status */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', flexShrink: 0, width: '100%', maxWidth: '180px' }}>
                <StatusPill status={sub.status} />
                {sub.status === 'rejected' && (
                  <button
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.5rem 1rem',
                      border: `1px solid ${T.border}`,
                      background: 'transparent',
                      color: T.muted,
                      fontFamily: T.fontMono, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = T.text; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
                  >
                    Revise <ArrowUpRight size={11} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
