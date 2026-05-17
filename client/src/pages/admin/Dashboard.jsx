import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { apiFetch } from '../../lib/api';

/* ── Design tokens (inline so no Tailwind dependency) ── */
const T = {
  fontMono: 'var(--font-accent)',
  fontDisplay: 'var(--font-heading)',
  fontBody: 'var(--font-primary)',
  muted: 'var(--text-muted)',
  text: 'var(--text-color)',
  bg: 'var(--bg-color)',
  red: '#C1121F',
  border: 'rgba(255,255,255,0.08)',
  slabBg: 'rgba(255,255,255,0.03)',
};

/* ── Reusable slab container ── */
function Slab({ children, style = {}, noPad = false }) {
  return (
    <section style={{
      border: `1px solid ${T.border}`,
      background: T.slabBg,
      padding: noPad ? 0 : '2rem',
      ...style,
    }}>
      {children}
    </section>
  );
}

/* ── Slab header label ── */
function SlabLabel({ children }) {
  return (
    <p style={{
      fontFamily: T.fontMono,
      fontSize: '0.7rem',
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
      color: T.muted,
      marginBottom: '1.5rem',
    }}>
      {children}
    </p>
  );
}

/* ── Stat cell (used inside Stats slab) ── */
function StatCell({ label, value, red = false, bordered = false }) {
  return (
    <div style={{
      padding: '2rem',
      borderRight: bordered ? `1px solid ${T.border}` : 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
    }}>
      <span style={{ fontFamily: T.fontMono, fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: T.muted }}>
        {label}
      </span>
      <span style={{
        fontFamily: T.fontDisplay,
        fontSize: 'clamp(3rem, 4.5vw, 5.5rem)',
        lineHeight: 1,
        letterSpacing: '-0.03em',
        color: red ? T.red : T.text,
      }}>
        {value}
      </span>
    </div>
  );
}

/* ── Analytics cell ── */
function AnalyticsCell({ label, value, bordered = false }) {
  return (
    <div style={{
      padding: '1.75rem 2rem',
      borderRight: bordered ? `1px solid ${T.border}` : 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
    }}>
      <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: T.muted }}>
        {label}
      </span>
      <span style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(1.6rem, 2.5vw, 2.8rem)', lineHeight: 1, color: T.text }}>
        {value}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total: '—', published: '—', pending: '—', rejected: '—' });
  const [analytics, setAnalytics] = useState({ total_views: '—', views_this_month: '—', avg_read_time: '—', top_category: '—' });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Existing content stats
    apiFetch('/blogs/stats')
      .then(data => setStats(data))
      .catch(err => console.error('Stats fetch failed:', err));

    // NEW SITE ANALYTICS
    fetch('http://localhost:8080/stats')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error('Analytics fetch failed:', err));

    apiFetch('/blogs/all')
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentActivity(sorted.slice(0, 5).map(b => ({
          title: b.title,
          action: b.status === 'pending' ? 'Awaiting review' : b.status === 'published' ? 'Published' : 'Rejected',
          time: formatRelativeTime(b.updatedAt || b.createdAt),
          status: b.status,
        })));
      })
      .catch(err => console.error('Activity fetch failed:', err));
  }, []);

  function formatRelativeTime(isoString) {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }
  return (
    <div style={{
      minHeight: 'calc(100vh - 5rem)',
      padding: 'clamp(2rem, 5vw, 4rem) 5vw 6rem',
      maxWidth: '1440px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    }}>

      {/* ══ PAGE HEADER ══ */}
      <header style={{ marginBottom: '1rem' }}>
        <p style={{ fontFamily: T.fontMono, fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.75rem' }}>
          Admin · Dashboard
        </p>
        <h1 style={{
          fontFamily: T.fontDisplay,
          fontSize: 'clamp(3.5rem, 6vw, 8rem)',
          lineHeight: 0.94,
          letterSpacing: '-0.04em',
          margin: 0,
          color: T.text,
        }}>
          Overview
        </h1>
      </header>

      {/* ══ ROW 1 — CONTENT STATS ══ */}
      <Slab noPad>
        {/* Slab top label bar */}
        <div style={{ padding: '1.25rem 2rem', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <SlabLabel>Content Stats</SlabLabel>
          <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted }}>Live</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <StatCell label="Total Blogs" value={stats.total}     bordered />
          <StatCell label="Published"   value={stats.published} bordered />
          <StatCell label="Pending"     value={stats.pending}   red />
        </div>
      </Slab>

      {/* ══ ROW 2 — ANALYTICS ══ */}
      <Slab noPad>
        <div style={{ padding: '1.25rem 2rem', borderBottom: `1px solid ${T.border}` }}>
          <SlabLabel>Site Analytics</SlabLabel>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <AnalyticsCell label="Total Views"  value={analytics.total_views || '—'} bordered />
          <AnalyticsCell label="This Month"   value={analytics.views_this_month || '—'}  bordered />
          <AnalyticsCell label="Avg Read Time" value={analytics.avg_read_time ? `${analytics.avg_read_time}s` : '—'} bordered />
          <AnalyticsCell label="Top Category" value={analytics.top_category || '—'} />
        </div>
      </Slab>

      {/* ══ ROW 3 — ACTIVITY + ACTIONS ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

        {/* Recent Activity slab */}
        <Slab noPad style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.25rem 2rem', borderBottom: `1px solid ${T.border}` }}>
            <SlabLabel>Recent Activity</SlabLabel>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentActivity.map((item, i) => (
              <div key={item.title} style={{
                padding: '1.25rem 2rem',
                borderBottom: i < recentActivity.length - 1 ? `1px solid ${T.border}` : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontFamily: T.fontDisplay, fontSize: '1rem', lineHeight: 1.25, color: T.text }}>
                    {item.title}
                  </span>
                  <span style={{
                    fontFamily: T.fontMono,
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: item.status === 'pending' ? T.red : T.muted,
                  }}>
                    {item.action} · {item.time}
                  </span>
                </div>
                {/* Status dot */}
                <div style={{
                  width: '8px', height: '8px',
                  borderRadius: '50%',
                  background: item.status === 'pending' ? T.red : 'rgba(255,255,255,0.25)',
                  flexShrink: 0,
                }} />
              </div>
            ))}
          </div>
        </Slab>

        {/* Actions slab */}
        <Slab style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <SlabLabel>Quick Actions</SlabLabel>

          <Link
            to="/admin/requests"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem',
              border: `1px solid ${T.border}`,
              background: 'rgba(193,18,31,0.05)',
              textDecoration: 'none',
              color: T.text,
              transition: 'border-color 0.25s, background 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(193,18,31,0.5)'; e.currentTarget.style.background = 'rgba(193,18,31,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'rgba(193,18,31,0.05)'; }}
          >
            <div>
              <p style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.4rem' }}>
                Pending · {stats.pending}
              </p>
              <p style={{ fontFamily: T.fontDisplay, fontSize: '1.5rem', lineHeight: 1.1, margin: 0 }}>
                Review Requests
              </p>
            </div>
            <div style={{ width: '2.4rem', height: '2.4rem', borderRadius: '999px', border: `1px solid rgba(193,18,31,0.4)`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <ArrowUpRight size={15} />
            </div>
          </Link>

          {/* Mini summary bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1px',
            background: T.border,
            marginTop: 'auto',
          }}>
            {[
              { label: 'Published', value: stats.published },
              { label: 'Rejected', value: stats.rejected },
              { label: 'Pending', value: stats.pending },
            ].map(({ label, value }) => (
              <div key={label} style={{ flex: 1, padding: '1rem', background: T.bg, textAlign: 'center' }}>
                <p style={{ fontFamily: T.fontMono, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.25rem' }}>{label}</p>
                <p style={{ fontFamily: T.fontDisplay, fontSize: '1.4rem', lineHeight: 1, color: T.text }}>{value}</p>
              </div>
            ))}
          </div>
        </Slab>
      </div>

    </div>
  );
}
