import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
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
  slabBg: 'rgba(255,255,255,0.025)',
};

const CATEGORIES = ['Design', 'Engineering', 'Creative Coding', 'Product', 'Culture', 'Research'];

/* ── Styled field wrapper ── */
function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label style={{ fontFamily: T.fontMono, fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: T.muted }}>
          {label}
        </label>
        {hint && <span style={{ fontFamily: T.fontMono, fontSize: '0.58rem', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.2)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputBase = {
  background: 'transparent',
  border: `1px solid rgba(255,255,255,0.1)`,
  color: '#fafafa',
  fontFamily: 'var(--font-primary)',
  fontSize: '0.95rem',
  padding: '0.85rem 1rem',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.25s',
  borderRadius: 0,
  caretColor: '#C1121F',
};

/* ── Success screen ── */
function SuccessView({ onReset, onView }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - 5rem)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '4rem 5vw',
      animation: 'fadein 0.5s ease',
      textAlign: 'center',
    }}>
      {/* Animated check circle */}
      <div style={{
        width: '5rem', height: '5rem', borderRadius: '50%',
        border: `1px solid rgba(193,18,31,0.4)`,
        background: 'rgba(193,18,31,0.08)',
        display: 'grid', placeItems: 'center',
        marginBottom: '2rem',
        animation: 'popin 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
      }}>
        <Check size={28} color="#C1121F" strokeWidth={1.5} />
      </div>

      <p style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.75rem' }}>
        Submission received
      </p>
      <h2 style={{
        fontFamily: T.fontDisplay,
        fontSize: 'clamp(2.5rem, 5vw, 5rem)',
        lineHeight: 0.95,
        letterSpacing: '-0.04em',
        color: T.text,
        maxWidth: '18ch',
        marginBottom: '1.5rem',
      }}>
        Your piece is in review.
      </h2>
      <p style={{ fontFamily: T.fontBody, fontSize: '0.95rem', color: T.muted, maxWidth: '36ch', lineHeight: 1.7, marginBottom: '2.5rem' }}>
        The editorial team will review your submission and get back to you. You can track the status under <em>My Work</em>.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onView}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.85rem 1.75rem',
            background: 'rgba(193,18,31,0.15)',
            border: `1px solid rgba(193,18,31,0.5)`,
            color: T.text,
            fontFamily: T.fontMono, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(193,18,31,0.28)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(193,18,31,0.15)'}
        >
          View my submissions <ArrowUpRight size={14} />
        </button>
        <button
          onClick={onReset}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.85rem 1.75rem',
            background: 'transparent',
            border: `1px solid ${T.border}`,
            color: T.muted,
            fontFamily: T.fontMono, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = T.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
        >
          Submit another
        </button>
      </div>

      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes popin  { from { opacity: 0; transform: scale(0.5) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN SUBMIT PAGE
   ══════════════════════════════════════════════ */
export default function PortalSubmit() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category: '', tags: '', coverImage: '',
  });
  const [focused, setFocused] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (k === 'content') setCharCount(e.target.value.length);
  };

  const canSubmit = form.title.trim() && form.excerpt.trim() && form.content.trim() && form.category;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await apiFetch('/blogs', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          category: form.category,
          tags: form.tags,
          coverImage: form.coverImage,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.message || 'Failed to submit blog');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm({ title: '', excerpt: '', content: '', category: '', tags: '', coverImage: '' });
    setCharCount(0);
    setSubmitted(false);
  };

  if (submitted) return <SuccessView onReset={reset} onView={() => navigate('/portal/submissions')} />;

  const readTime = Math.max(1, Math.ceil(charCount / 1000));

  return (
    <div style={{ minHeight: 'calc(100vh - 5rem)', padding: 'clamp(2rem, 5vw, 4rem) 5vw 8rem', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ── */}
      <header style={{ marginBottom: '0.5rem' }}>
        <p style={{ fontFamily: T.fontMono, fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.75rem' }}>
          Portal · Submit
        </p>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(3.5rem, 6vw, 8rem)', lineHeight: 0.94, letterSpacing: '-0.04em', margin: 0, color: T.text }}>
          New Piece
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── Row 1: Title + Category ── */}
        <div style={{
          border: `1px solid ${T.border}`,
          background: T.slabBg,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}>
          {/* Title */}
          <div style={{ padding: 'clamp(1.25rem, 4vw, 2rem)', borderRight: `1px solid ${T.border}` }}>
            <p style={{ fontFamily: T.fontMono, fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.75rem' }}>
              Title
            </p>
            <input
              id="submit-title"
              type="text"
              placeholder="Your article title…"
              value={form.title}
              onChange={set('title')}
              onFocus={() => setFocused('title')}
              onBlur={() => setFocused('')}
              style={{
                ...inputBase,
                border: 'none',
                padding: '0',
                fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)',
                fontFamily: T.fontDisplay,
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                borderBottom: `1px solid ${focused === 'title' ? 'rgba(255,255,255,0.35)' : T.border}`,
                paddingBottom: '0.5rem',
              }}
            />
          </div>

          {/* Category pills */}
          <div style={{ padding: 'clamp(1.25rem, 4vw, 2rem)', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
            <p style={{ fontFamily: T.fontMono, fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.25rem' }}>
              Category
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat }))}
                  style={{
                    padding: '0.45rem 0.9rem',
                    border: `1px solid ${form.category === cat ? T.red : T.border}`,
                    borderRadius: '999px',
                    background: form.category === cat ? 'rgba(193,18,31,0.15)' : 'transparent',
                    color: form.category === cat ? T.text : T.muted,
                    fontFamily: T.fontMono,
                    fontSize: '0.62rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 2: Excerpt ── */}
        <div style={{ border: `1px solid ${T.border}`, background: T.slabBg, padding: 'clamp(1.25rem, 4vw, 2rem)' }}>
          <Field label="Excerpt" hint="A one-line hook for the reader">
            <textarea
              id="submit-excerpt"
              placeholder="A compelling one-sentence summary of your article…"
              value={form.excerpt}
              onChange={set('excerpt')}
              rows={2}
              onFocus={() => setFocused('excerpt')}
              onBlur={() => setFocused('')}
              style={{
                ...inputBase,
                border: 'none',
                borderBottom: `1px solid ${focused === 'excerpt' ? 'rgba(255,255,255,0.3)' : T.border}`,
                padding: '0.5rem 0',
                resize: 'none',
                fontFamily: T.fontDisplay,
                fontSize: '1.05rem',
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}
            />
          </Field>
        </div>

        {/* ── Row 3: Content ── */}
        <div style={{ border: `1px solid ${T.border}`, background: T.slabBg }}>
          {/* Slab header */}
          <div style={{ padding: '1.25rem clamp(1.25rem, 4vw, 2rem)', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: T.fontMono, fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: T.muted, margin: 0 }}>
              Article Body
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span style={{ fontFamily: T.fontMono, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                {charCount} chars
              </span>
              <span style={{ fontFamily: T.fontMono, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: charCount > 500 ? T.muted : 'rgba(255,255,255,0.2)' }}>
                ~{readTime} min read
              </span>
            </div>
          </div>
          <div style={{ padding: 'clamp(1.25rem, 4vw, 2rem)' }}>
            <textarea
              id="submit-content"
              placeholder="Write your full article here. Markdown will be supported on publish…"
              value={form.content}
              onChange={set('content')}
              onFocus={() => setFocused('content')}
              onBlur={() => setFocused('')}
              rows={18}
              style={{
                ...inputBase,
                border: 'none',
                padding: 0,
                resize: 'vertical',
                fontFamily: T.fontBody,
                fontSize: '1rem',
                lineHeight: 1.9,
                color: 'rgba(255,255,255,0.8)',
                minHeight: '320px',
              }}
            />
          </div>
        </div>

        {/* ── Row 4: Tags + Cover ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ border: `1px solid ${T.border}`, background: T.slabBg, padding: 'clamp(1.25rem, 4vw, 2rem)' }}>
            <Field label="Tags" hint="Comma separated">
              <input
                id="submit-tags"
                type="text"
                placeholder="e.g. Design, Typography, Editorial"
                value={form.tags}
                onChange={set('tags')}
                onFocus={() => setFocused('tags')}
                onBlur={() => setFocused('')}
                style={{
                  ...inputBase,
                  border: 'none',
                  borderBottom: `1px solid ${focused === 'tags' ? 'rgba(255,255,255,0.3)' : T.border}`,
                  padding: '0.5rem 0',
                }}
              />
              {/* Tag preview chips */}
              {form.tags && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                    <span key={tag} style={{
                      fontFamily: T.fontMono, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: T.muted, border: `1px solid ${T.border}`, borderRadius: '999px', padding: '0.25rem 0.65rem',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </div>

          <div style={{ border: `1px solid ${T.border}`, background: T.slabBg, padding: 'clamp(1.25rem, 4vw, 2rem)' }}>
            <Field label="Cover Image URL" hint="Optional">
              <input
                id="submit-cover"
                type="url"
                placeholder="https://images.unsplash.com/…"
                value={form.coverImage}
                onChange={set('coverImage')}
                onFocus={() => setFocused('cover')}
                onBlur={() => setFocused('')}
                style={{
                  ...inputBase,
                  border: 'none',
                  borderBottom: `1px solid ${focused === 'cover' ? 'rgba(255,255,255,0.3)' : T.border}`,
                  padding: '0.5rem 0',
                  fontFamily: T.fontMono,
                  fontSize: '0.78rem',
                }}
              />
              {form.coverImage && (
                <div style={{ marginTop: '0.75rem', height: '80px', overflow: 'hidden', border: `1px solid ${T.border}` }}>
                  <img
                    src={form.coverImage}
                    alt="Cover preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                    onError={e => e.currentTarget.style.display = 'none'}
                  />
                </div>
              )}
            </Field>
          </div>
        </div>

        {/* ── Sticky submit bar ── */}
        <div style={{
          position: 'sticky',
          bottom: '1.5rem',
          border: `1px solid ${T.border}`,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          padding: '1.25rem clamp(1rem, 4vw, 2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontFamily: T.fontMono, fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: T.muted }}>
              Submitting as
            </span>
            <span style={{ fontFamily: T.fontBody, fontSize: '0.9rem', color: T.text }}>
              {user?.name}
            </span>
          </div>

          {/* Required fields indicator */}
          <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 240px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Title', done: !!form.title.trim() },
              { label: 'Excerpt', done: !!form.excerpt.trim() },
              { label: 'Category', done: !!form.category },
              { label: 'Body', done: !!form.content.trim() },
            ].map(({ label, done }) => (
              <span key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                fontFamily: T.fontMono, fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                color: done ? T.text : 'rgba(255,255,255,0.25)',
                transition: 'color 0.3s',
              }}>
                <span style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: done ? T.red : 'rgba(255,255,255,0.15)',
                  flexShrink: 0,
                  transition: 'background 0.3s',
                }} />
                {label}
              </span>
            ))}
          </div>

          <button
            id="submit-btn"
            type="submit"
            disabled={!canSubmit || submitting}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.9rem 2rem',
              background: canSubmit ? 'rgba(193,18,31,0.2)' : 'transparent',
              border: `1px solid ${canSubmit ? 'rgba(193,18,31,0.6)' : T.border}`,
              color: canSubmit ? T.text : T.muted,
              fontFamily: T.fontMono, fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'all 0.25s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (canSubmit && !submitting) { e.currentTarget.style.background = 'rgba(193,18,31,0.35)'; e.currentTarget.style.borderColor = T.red; } }}
            onMouseLeave={e => { e.currentTarget.style.background = canSubmit ? 'rgba(193,18,31,0.2)' : 'transparent'; e.currentTarget.style.borderColor = canSubmit ? 'rgba(193,18,31,0.6)' : T.border; }}
          >
            {submitting ? 'Sending…' : 'Submit for review'}
            {!submitting && <ArrowUpRight size={15} />}
            {submitting && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        input:focus, textarea:focus { border-color: rgba(255,255,255,0.3) !important; }
      `}</style>
    </div>
  );
}
