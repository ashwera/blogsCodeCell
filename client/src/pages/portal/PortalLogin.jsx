import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

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
  const { login, register, loading, error, setError, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('admin@codecell.dev');
  const [password, setPassword] = useState('codecell123');
  const [name, setName]         = useState('');
  const [shake, setShake]       = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Clear error when user types
  useEffect(() => { if (error) setError(''); }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (isSignUp) {
      result = await register(name, email, password);
    } else {
      result = await login(email, password);
    }
    
    if (!result) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } else {
      navigate('/', { replace: true });
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

      {/* Back to site button */}
      <NavLink
        to="/"
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
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
          zIndex: 10,
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
            {isSignUp ? 'Create an' : 'Contributor'} <br /> 
            {isSignUp ? 'Account' : 'Access'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {isSignUp && (
            <Field
              id="register-name"
              label="Full Name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ayesha R."
              autoFocus
            />
          )}
          <Field
            id="login-email"
            label="Email address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoFocus={!isSignUp}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem', alignItems: 'flex-start' }}>
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setShake(false); }}
              style={{
                background: 'none', border: 'none', color: T.muted, textDecoration: 'none',
                fontFamily: T.fontMono, fontSize: '0.65rem', cursor: 'pointer', padding: 0,
                letterSpacing: '0.05em'
              }}
              onMouseEnter={e => e.currentTarget.style.color = T.text}
              onMouseLeave={e => e.currentTarget.style.color = T.muted}
            >
              {isSignUp ? 'Already have an account?' : 'Need an account?'}
            </button>
            <button
              id="login-submit"
              type="submit"
              disabled={loading || !email || !password || (isSignUp && !name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.8rem 1.2rem',
                background: loading ? 'rgba(193,18,31,0.12)' : 'rgba(193,18,31,0.15)',
                border: `1px solid ${loading ? 'rgba(193,18,31,0.3)' : 'rgba(193,18,31,0.55)'}`,
                color: (!email || !password || (isSignUp && !name)) ? T.muted : T.text,
                fontFamily: T.fontBody,
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: (loading || !email || !password || (isSignUp && !name)) ? 'not-allowed' : 'pointer',
                transition: 'border-color 0.25s, background 0.25s, color 0.25s',
              }}
              onMouseEnter={e => {
                if (!loading && email && password && (!isSignUp || name)) {
                  e.currentTarget.style.background = 'rgba(193,18,31,0.25)';
                  e.currentTarget.style.borderColor = T.red;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(193,18,31,0.15)';
                e.currentTarget.style.borderColor = 'rgba(193,18,31,0.55)';
              }}
            >
              <span>{loading ? 'Processing…' : (isSignUp ? 'Register' : 'Sign in')}</span>
              {!loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '2rem'}}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
              {loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  style={{ animation: 'spin 0.8s linear infinite', marginLeft: '2rem' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              )}
            </button>
          </div>
        </form>
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
