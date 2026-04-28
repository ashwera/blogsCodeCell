import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Check, X, ArrowLeft } from 'lucide-react';
import { apiFetch } from '../../lib/api';

/* ── Design tokens ── */
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

/* ── Slab container ── */
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

/* ── Slab header label bar ── */
function SlabLabel({ children, extra }) {
  return (
    <div style={{ padding: '1.25rem 2rem', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
      <p style={{ fontFamily: T.fontMono, fontSize: '0.7rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: T.muted, margin: 0 }}>
        {children}
      </p>
      {extra && <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.muted }}>{extra}</span>}
    </div>
  );
}

/* ── Pill action button ── */
function PillBtn({ onClick, red = false, children, icon }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.65rem',
        padding: '0.75rem 1.75rem 0.75rem 1.1rem',
        border: `1px solid ${red ? (hovered ? T.red : 'rgba(193,18,31,0.45)') : (hovered ? 'rgba(255,255,255,0.3)' : T.border)}`,
        borderRadius: '999px',
        background: 'transparent',
        color: hovered ? T.text : T.muted,
        fontFamily: T.fontBody,
        fontSize: '0.82rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'border-color 0.2s, color 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{ width: '1.9rem', height: '1.9rem', borderRadius: '999px', background: red ? 'rgba(193,18,31,0.14)' : 'rgba(255,255,255,0.06)', display: 'grid', placeItems: 'center' }}>
        {icon}
      </div>
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════
   PREVIEW PANEL — full-screen slide-in overlay
   ═══════════════════════════════════════════ */

function BlogPreview({ request, onClose, onAccept, onDecline }) {
  // Prevent body scroll while preview is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const patterns = [
    'radial-gradient(circle at 30% 40%, #1a1a1a 0%, #000 100%)',
    'linear-gradient(135deg, #111 25%, #000 25%, #000 50%, #111 50%, #111 75%, #000 75%)',
    'repeating-linear-gradient(90deg, #000, #000 12px, #111 12px, #111 24px)',
  ];
  const patternIdx = (request._id ? request._id.charCodeAt(request._id.length - 1) : 1) % 3;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          animation: 'fadein 0.3s ease',
        }}
      />

      {/* Panel — Centered Modal */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 50,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        padding: '0 3vw 8rem',
        animation: 'fadein 0.4s ease',
      }}>

        {/* ── Focused Reader Container ── */}
        <div style={{
          width: '100%',
          maxWidth: '740px',
          background: '#000000',
          borderLeft: `1px solid ${T.border}`,
          borderRight: `1px solid ${T.border}`,
          position: 'relative',
          minHeight: '100vh',
        }}>

          {/* ── Top bar (pinned to top) ── */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap',
            padding: '1.25rem clamp(1rem, 4vw, 2rem)',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${T.border}`,
          }}>
            <button
              onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: T.muted, fontFamily: T.fontMono, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s', padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = T.text}
              onMouseLeave={e => e.currentTarget.style.color = T.muted}
            >
              <ArrowLeft size={13} /> Exit Preview
            </button>
            <span style={{
              fontFamily: T.fontMono, fontSize: '0.62rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: T.red,
            }}>
              Submission Review
            </span>
          </div>

          {/* ── Article content ── */}
          <div style={{ padding: '0 0 4rem' }}>
            {/* Cover image */}
            <div style={{
              width: '100%', aspectRatio: '16/8',
              background: patterns[patternIdx],
              borderBottom: `1px solid ${T.border}`,
            }} />

            <article style={{ padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 5vw, 3rem)' }}>
              {/* Meta */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: T.fontMono, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: T.red }}>
                  {request.category}
                </span>
                <span style={{ width: '4px', height: '4px', background: T.border, borderRadius: '50%' }} />
                <span style={{ fontFamily: T.fontMono, fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: T.muted }}>
                  {request.authorName}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: T.fontDisplay,
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                margin: '0 0 2.5rem',
                color: T.text,
                textAlign: 'center',
              }}>
                {request.title}
              </h1>

              {/* Excerpt lead */}
              <p style={{
                fontFamily: T.fontDisplay,
                fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '3.5rem',
                textAlign: 'center',
                fontStyle: 'italic',
                maxWidth: '90%',
                margin: '0 auto 3.5rem',
              }}>
                {request.excerpt}
              </p>

              {/* Divider */}
              <div style={{ width: '40px', height: '1px', background: T.red, margin: '0 auto 3.5rem' }} />

              {/* Body text — actual submitted content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {(request.content || '').split('\n\n').filter(Boolean).map((para, i) => (
                  <p key={i} style={{
                    fontFamily: T.fontBody,
                    fontSize: 'clamp(1rem, 2.5vw, 1.12rem)',
                    lineHeight: 1.95,
                    color: 'rgba(255,255,255,0.7)',
                    letterSpacing: '0.01em',
                  }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Tags — real data from submission */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {(request.tags && request.tags.length > 0 ? request.tags : [request.category]).map(tag => (
                  <span key={tag} style={{
                    fontFamily: T.fontMono, fontSize: '0.62rem', letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
                    border: `1px solid ${T.border}`,
                    borderRadius: '999px', padding: '0.35rem 1rem',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </div>

          {/* ── Bottom action bar (fixed inside modal container) ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
            padding: '1.25rem clamp(1rem, 4vw, 2.5rem)',
            background: 'rgba(10,10,10,0.98)',
            borderTop: `1px solid ${T.border}`,
          }}>
            <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted }}>
              Review Decision
            </span>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <PillBtn onClick={onDecline} icon={<X size={12} />}>Decline</PillBtn>
              <PillBtn red onClick={onAccept} icon={<Check size={12} />}>Publish Piece</PillBtn>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes fadein  { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════
   REQUESTS PAGE
   ═══════════════════════════════════════════ */
/* ── Requests Dashboard mapped to Live API ── */

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [preview, setPreview] = useState(null); // request being previewed

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await apiFetch('/blogs/all');
        setRequests(data);
      } catch (err) {
        console.error('Failed to load requests:', err);
      }
    };
    fetchRequests();
  }, []);

  const handle = async (id, action) => {
    try {
      await apiFetch(`/blogs/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: action })
      });
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: action } : r));
      setPreview(null);
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  const pending = requests.filter(r => r.status === 'pending');
  const done    = requests.filter(r => r.status !== 'pending');

  return (
    <>
      <div style={{ minHeight: 'calc(100vh - 5rem)', padding: 'clamp(2rem, 5vw, 4rem) 5vw 6rem', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── Header ── */}
        <header style={{ marginBottom: '1rem' }}>
          <p style={{ fontFamily: T.fontMono, fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.75rem' }}>
            Admin · Requests
          </p>
          <h1 style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(3.5rem, 6vw, 8rem)', lineHeight: 0.94, letterSpacing: '-0.04em', margin: 0, color: T.text }}>
            Incoming
          </h1>
        </header>

        {/* ── Counter slab ── */}
        <Slab noPad>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <div style={{ padding: '1.5rem 2rem', borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: T.muted }}>Awaiting Review</span>
              <span style={{ fontFamily: T.fontDisplay, fontSize: '2.5rem', lineHeight: 1, color: T.red }}>{pending.length}</span>
            </div>
            <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: T.muted }}>Resolved</span>
              <span style={{ fontFamily: T.fontDisplay, fontSize: '2.5rem', lineHeight: 1, color: T.text }}>{done.length}</span>
            </div>
          </div>
        </Slab>

        {/* ── Pending slab ── */}
        {pending.length > 0 && (
          <Slab noPad>
            <SlabLabel extra={`${pending.length} pending`}>Pending Review</SlabLabel>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {pending.map((req, i) => (
                <div key={req._id} style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  alignItems: 'center',
                  gap: '2rem',
                  padding: '1.75rem 2rem',
                  borderBottom: i < pending.length - 1 ? `1px solid ${T.border}` : 'none',
                  transition: 'background 0.2s',
                }}>
                  {/* Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.red }}>{req.category}</span>
                      <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: T.muted }}>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(1.25rem, 2.2vw, 1.85rem)', lineHeight: 1.15, margin: 0, color: T.text }}>
                      {req.title}
                    </h2>
                    <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted }}>
                      by {req.authorName}
                    </span>
                  </div>

                  {/* "Preview" button */}
                  <button
                    onClick={() => setPreview(req)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.65rem 1.3rem 0.65rem 1rem',
                      border: `1px solid ${T.border}`,
                      borderRadius: '999px',
                      background: 'transparent',
                      color: T.muted,
                      fontFamily: T.fontBody,
                      fontSize: '0.8rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = T.text; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
                  >
                    <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', display: 'grid', placeItems: 'center' }}>
                      <ArrowUpRight size={12} />
                    </div>
                    Preview
                  </button>
                </div>
              ))}
            </div>
          </Slab>
        )}

        {/* ── Resolved slab ── */}
        {done.length > 0 && (
          <Slab noPad>
            <SlabLabel extra={`${done.length} resolved`}>Resolved</SlabLabel>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {done.map((req, i) => (
                <div key={req._id} style={{
                  padding: '1.25rem 2rem',
                  borderBottom: i < done.length - 1 ? `1px solid ${T.border}` : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontFamily: T.fontDisplay, fontSize: '1.05rem', lineHeight: 1.2, color: T.text }}>{req.title}</span>
                    <span style={{ fontFamily: T.fontMono, fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted }}>by {req.authorName}</span>
                  </div>
                  <span style={{
                    fontFamily: T.fontMono, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: req.status === 'published' ? T.red : T.muted,
                    border: `1px solid ${req.status === 'published' ? 'rgba(193,18,31,0.4)' : T.border}`,
                    borderRadius: '999px', padding: '0.3rem 0.9rem', flexShrink: 0,
                  }}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </Slab>
        )}

        {pending.length === 0 && done.length === 0 && (
          <Slab>
            <p style={{ fontFamily: T.fontMono, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted }}>
              No requests at this time.
            </p>
          </Slab>
        )}

      </div>

      {/* ── Preview panel (portal-like, rendered at end of tree) ── */}
      {preview && (
        <BlogPreview
          request={preview}
          onClose={() => setPreview(null)}
          onAccept={() => handle(preview._id, 'published')}
          onDecline={() => handle(preview._id, 'rejected')}
        />
      )}
    </>
  );
}
