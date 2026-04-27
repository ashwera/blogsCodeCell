import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useNavigate } from 'react-router-dom';

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
};

/* ── Animated noise grain overlay ── */
const GrainOverlay = () => (
  <div style={{
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
    opacity: 0.035,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '200px',
  }} />
);

/* ── Single input field ── */
function Field({ id, label, type, value, onChange, placeholder, autoFocus }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: T.fontMono,
          fontSize: '0.62rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: focused ? T.text : T.muted,
          transition: 'color 0.2s',
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${focused ? 'rgba(255,255,255,0.35)' : T.border}`,
          color: T.text,
          fontFamily: T.fontBody,
          fontSize: '1rem',
          padding: '0.75rem 0',
          outline: 'none',
          width: '100%',
          transition: 'border-color 0.25s',
          caretColor: T.red,
        }}
      />
    </div>
  );
}

export default function PortalLogin() {
  const { login, loading, error, setError, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [shake, setShake]       = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/portal', { replace: true });
    }
  }, [user, navigate]);

  // Clear error when user types
  useEffect(() => { if (error) setError(''); }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } else {
      navigate(result.role === 'admin' ? '/admin' : '/portal', { replace: true });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <GrainOverlay />

      {/* Background decorative text */}
      <div style={{
        position: 'absolute',
        bottom: '-2rem',
        right: '-1rem',
        fontFamily: T.fontDisplay,
        fontSize: 'clamp(8rem, 18vw, 22rem)',
        lineHeight: 1,
        color: 'rgba(255,255,255,0.025)',
        letterSpacing: '-0.05em',
        userSelect: 'none',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        codecell
      </div>

      {/* Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '440px',
          border: `1px solid ${T.border}`,
          background: 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '3rem',
          animation: shake ? 'shake 0.45s ease' : 'fadein 0.5s ease',
        }}
      >
        {/* Logo / brand */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{
            fontFamily: T.fontMono,
            fontSize: '0.62rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: T.muted,
            marginBottom: '0.75rem',
          }}>
            codecell <span style={{ color: T.red }}>portal</span>
          </p>
          <h1 style={{
            fontFamily: T.fontDisplay,
            fontSize: 'clamp(2.2rem, 5vw, 3rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            color: T.text,
            margin: 0,
          }}>
            Contributor<br />Access
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <Field
            id="login-email"
            label="Email address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoFocus
          />
          <Field
            id="login-password"
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {/* Error message */}
          {error && (
            <p style={{
              fontFamily: T.fontMono,
              fontSize: '0.68rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: T.red,
              margin: 0,
              animation: 'fadein 0.2s ease',
            }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading || !email || !password}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.1rem 1.5rem',
              background: loading ? 'rgba(193,18,31,0.12)' : 'rgba(193,18,31,0.15)',
              border: `1px solid ${loading ? 'rgba(193,18,31,0.3)' : 'rgba(193,18,31,0.55)'}`,
              color: (!email || !password) ? T.muted : T.text,
              fontFamily: T.fontBody,
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: (loading || !email || !password) ? 'not-allowed' : 'pointer',
              transition: 'border-color 0.25s, background 0.25s, color 0.25s',
              marginTop: '0.5rem',
            }}
            onMouseEnter={e => {
              if (!loading && email && password) {
                e.currentTarget.style.background = 'rgba(193,18,31,0.25)';
                e.currentTarget.style.borderColor = T.red;
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(193,18,31,0.15)';
              e.currentTarget.style.borderColor = 'rgba(193,18,31,0.55)';
            }}
          >
            <span>{loading ? 'Signing in…' : 'Sign in'}</span>
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
            {loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                style={{ animation: 'spin 0.8s linear infinite' }}>
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            )}
          </button>
        </form>

        {/* Demo hint */}
        <div style={{
          marginTop: '2.5rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${T.border}`,
        }}>
          <p style={{ fontFamily: T.fontMono, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '0.5rem' }}>
            Demo credentials
          </p>
          <p style={{ fontFamily: T.fontMono, fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
            Contributor: ayesha@contributor.dev<br />
            Admin: admin@codecell.dev<br />
            Password (both): codecell123
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes shake {
          0%, 100% { transform: translateX(0) }
          20%       { transform: translateX(-8px) }
          40%       { transform: translateX(8px) }
          60%       { transform: translateX(-5px) }
          80%       { transform: translateX(5px) }
        }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}
