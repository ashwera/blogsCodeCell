import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Share2 } from 'lucide-react';
import { apiFetch } from '../lib/api';

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

const BODY_LOREM = `The concept of emptiness has fascinated designers for centuries — from the negative space in Japanese ink painting to the radical white pages of modernist publishing.

In digital interfaces, we call it "white space," but the name misleads. It is not a void. It is an active force — a rhythm that lets the eye rest, lets meaning breathe.

The best interfaces I've studied share a quality: restraint. Every element present is necessary. Every margin is deliberate. The designer's job is not to fill the screen, but to resist filling it.

When we design for nothingness — for the pause, the gap, the margin — we are designing for the reader's mind. We are leaving room for thought to arrive.

This is the architecture of nothingness: not absence, but intentional space.`;

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await apiFetch(`/blogs/${id}`);
        setBlog(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div style={{ background: '#000', height: '100vh', display: 'grid', placeItems: 'center', color: '#fff' }}>Loading...</div>;
  if (!blog) return <div style={{ background: '#000', height: '100vh', display: 'grid', placeItems: 'center', color: '#fff' }}>Blog not found.</div>;
  
  const readTime = Math.max(1, Math.ceil(blog.content.length / 1000)) + ' min read';

  return (
    <div style={{ background: '#000000', minHeight: '100vh', paddingBottom: '10rem' }}>
      
      {/* ── Fixed Reading Progress / Nav ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 30,
        background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
        borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
        padding: '1rem 5vw',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.4s ease',
      }}>
        <button 
          onClick={() => navigate('/blogs')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: T.muted, fontFamily: T.fontMono, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = T.text}
          onMouseLeave={e => e.currentTarget.style.color = T.muted}
        >
          <ArrowLeft size={14} /> Back
        </button>

        {scrolled && (
          <span style={{ fontFamily: T.fontDisplay, fontSize: '0.9rem', color: T.text, opacity: 0.8, animation: 'fadein 0.3s ease' }}>
            {blog.title}
          </span>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ color: T.muted, background: 'none', border: 'none', cursor: 'pointer' }}><Share2 size={16} /></button>
        </div>
      </header>

      {/* ── Hero section ── */}
      <section style={{
        width: '100%',
        height: '70vh',
        background: 'radial-gradient(circle at 30% 40%, #1a1a1a 0%, #000 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 5vw',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: T.fontMono, fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: T.red, marginBottom: '1.5rem' }}>
          {blog.category}
        </p>
        <h1 style={{
          fontFamily: T.fontDisplay,
          fontSize: 'clamp(3rem, 7vw, 6rem)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          maxWidth: '12ch',
          margin: '0 auto 2rem',
        }}>
          {blog.title}
        </h1>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted }}>By {blog.authorName}</span>
          <span style={{ width: '4px', height: '4px', background: T.border, borderRadius: '50%' }} />
          <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted }}>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
      </section>

      {/* ── Main Article Body (The Wattpad Focus) ── */}
      <main style={{
        maxWidth: '740px',
        margin: '0 auto',
        padding: '5rem 2rem',
      }}>
        
        {/* Excerpt Lead */}
        <p style={{
          fontFamily: T.fontDisplay,
          fontSize: '1.4rem',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.9)',
          marginBottom: '4rem',
          fontStyle: 'italic',
          borderLeft: `2px solid ${T.red}`,
          paddingLeft: '2rem',
        }}>
          {blog.excerpt}
        </p>

        {/* Info bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem', padding: '1rem 0', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
          <Clock size={14} color={T.muted} />
          <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: T.muted }}>
            {readTime}
          </span>
        </div>

        {/* Content paragraphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {blog.content.split('\n\n').map((para, i) => (
            <p key={i} style={{
              fontFamily: T.fontBody,
              fontSize: '1.15rem',
              lineHeight: 1.95,
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.012em',
            }}>
              {para}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '5rem', flexWrap: 'wrap' }}>
          {(blog.tags && blog.tags.length > 0 ? blog.tags : [blog.category]).map(tag => (
            <span key={tag} style={{
              fontFamily: T.fontMono, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: T.muted, border: `1px solid ${T.border}`, borderRadius: '999px', padding: '0.35rem 1rem',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </main>

      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
