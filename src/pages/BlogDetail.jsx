import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Share2 } from 'lucide-react'
import { getBlog } from '../lib/blogs'

const T = {
  fontMono: 'var(--font-accent)',
  fontDisplay: 'var(--font-heading)',
  fontBody: 'var(--font-primary)',
  muted: 'var(--text-muted)',
  text: 'var(--text-color)',
  bg: 'var(--bg-color)',
  red: '#C1121F',
  border: 'rgba(255,255,255,0.08)',
}

const renderBlockContent = (block) => {
  const commonStyle = {
    fontFamily: T.fontBody,
    fontSize: 'clamp(1rem, 2.4vw, 1.15rem)',
    lineHeight: 1.9,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: '0.012em',
  }

  switch (block.type) {
    case 'h1':
      return (
        <h2 style={{ ...commonStyle, fontSize: '2rem', fontFamily: T.fontDisplay, marginBottom: '1.5rem', color: '#fff' }}>
          {block.content}
        </h2>
      )
    case 'h2':
      return (
        <h3 style={{ ...commonStyle, fontSize: '1.5rem', fontFamily: T.fontDisplay, marginBottom: '1.2rem', color: '#fff' }}>
          {block.content}
        </h3>
      )
    case 'h3':
      return (
        <h4 style={{ ...commonStyle, fontSize: '1.25rem', fontFamily: T.fontDisplay, marginBottom: '1rem', color: '#fff' }}>
          {block.content}
        </h4>
      )
    case 'quote':
      return (
        <blockquote style={{
          borderLeft: `3px solid ${T.red}`,
          paddingLeft: '1.5rem',
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.85)',
          marginBottom: '2rem',
          ...commonStyle,
        }}>
          {block.content}
        </blockquote>
      )
    case 'ul':
      return (
        <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>
          {block.content.split('\n').filter(item => item.trim()).map((item, i) => (
            <li key={i} style={{ ...commonStyle, marginBottom: '0.5rem' }}>
              {item.trim().replace(/^[-*]\s?/, '')}
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>
          {block.content.split('\n').filter(item => item.trim()).map((item, i) => (
            <li key={i} style={{ ...commonStyle, marginBottom: '0.5rem' }}>
              {item.trim().replace(/^\d+\.\s?/, '')}
            </li>
          ))}
        </ol>
      )
    case 'image':
      // Handle image block with URL
      if (typeof block.content === 'object' && block.content.url) {
        return (
          <figure style={{ marginBottom: '2rem' }}>
            <img 
              src={block.content.url} 
              alt="blog content" 
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem'
              }} 
            />
          </figure>
        )
      }
      return null
    case 'hr':
      return <hr style={{ borderColor: T.border, marginBottom: '2rem', marginTop: '2rem' }} />
    case 'paragraph':
      // Handle markdown images in paragraphs (legacy)
      if (block.content && typeof block.content === 'string' && block.content.includes('![')){  
        const imageRegex = /!\[.*?\]\((.*?)\)/
        const match = block.content.match(imageRegex)
        if (match && match[1]) {
          return (
            <figure style={{ marginBottom: '2rem' }}>
              <img 
                src={match[1]} 
                alt="blog content" 
                style={{
                  width: '100%',
                  maxHeight: '500px',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                  marginBottom: '0.5rem'
                }} 
              />
            </figure>
          )
        }
      }
      return (
        <p style={{ ...commonStyle, marginBottom: '2rem' }}>
          {block.content}
        </p>
      )
    default:
      return (
        <p style={{ ...commonStyle, marginBottom: '2rem' }}>
          {block.content}
        </p>
      )
  }
}

export default function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    getBlog(id)
      .then(setBlog)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading)
    return (
      <div style={{ background: '#000', height: '100vh', display: 'grid', placeItems: 'center', color: '#fff' }}>
        Loading...
      </div>
    )
  if (!blog)
    return (
      <div style={{ background: '#000', height: '100vh', display: 'grid', placeItems: 'center', color: '#fff' }}>
        Blog not found.
      </div>
    )

  const getContentLength = () => {
    if (blog.blocks && Array.isArray(blog.blocks)) {
      return blog.blocks.reduce((total, block) => total + (block.content?.length || 0), 0)
    }
    return blog.content?.length || 0
  }
  
  const readTime = Math.max(1, Math.ceil(getContentLength() / 1000)) + ' min read'
  const isLongTitle = blog.title.length > 48
  const createdAt = blog.createdAt?.toDate
    ? blog.createdAt.toDate().toLocaleDateString()
    : new Date(blog.createdAt).toLocaleDateString()

  return (
    <div style={{ background: '#000000', minHeight: '100vh', paddingBottom: '10rem' }}>

      {/* Fixed header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 30,
        background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
        borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
        padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1rem, 5vw, 5vw)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'nowrap',
        transition: 'all 0.4s ease',
      }}>
        <button
          onClick={() => navigate('/blogs')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: T.muted, fontFamily: T.fontMono, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.color = T.text)}
          onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
        >
          <ArrowLeft size={14} /> Back
        </button>

        {scrolled && (
          <span style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: T.text, opacity: 0.8, animation: 'fadein 0.3s ease', flex: '1 1 240px', textAlign: 'center' }}>
            {blog.title}
          </span>
        )}

        <button
          style={{ color: T.muted, background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => navigator.share?.({ title: blog.title, url: window.location.href })}
        >
          <Share2 size={16} />
        </button>
      </header>

      {/* Hero */}
      <section style={{
        width: '100%', minHeight: '55vh',
        background: 'radial-gradient(circle at 30% 40%, #1a1a1a 0%, #000 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(4.5rem, 12vw, 5.5rem) clamp(1.25rem, 5vw, 5vw) clamp(2rem, 5vw, 3rem)', textAlign: 'center',
      }}>
        <p style={{ fontFamily: T.fontMono, fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: T.red, marginBottom: '1.5rem' }}>
          {blog.category}
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', var(--font-heading)",
          fontSize: isLongTitle ? 'clamp(2rem, 7vw, 4.75rem)' : 'clamp(2.5rem, 8vw, 6rem)',
          lineHeight: isLongTitle ? 1.06 : 1.02,
          letterSpacing: '-0.03em',
          maxWidth: '14ch', margin: '0 auto 2rem', overflowWrap: 'anywhere',
        }}>
          {blog.title}
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted }}>
            By {blog.authorName}
          </span>
          <span style={{ width: '4px', height: '4px', background: T.border, borderRadius: '50%' }} />
          <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted }}>
            {createdAt}
          </span>
        </div>
      </section>

      {/* Article body */}
      <main style={{ maxWidth: '740px', margin: '0 auto', padding: 'clamp(2rem, 6vw, 5rem) clamp(1.25rem, 5vw, 2rem)' }}>
        {blog.excerpt && (
          <p style={{
            fontFamily: T.fontDisplay,
            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
            lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', marginBottom: '4rem',
            fontStyle: 'italic', borderLeft: `2px solid ${T.red}`, paddingLeft: 'clamp(1rem, 4vw, 2rem)',
          }}>
            {blog.excerpt}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem', padding: '1rem 0', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
          <Clock size={14} color={T.muted} />
          <span style={{ fontFamily: T.fontMono, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: T.muted }}>
            {readTime}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {blog.blocks && Array.isArray(blog.blocks) ? (
            // Render blocks if available
            blog.blocks.map((block, i) => (
              <div key={i}>
                {renderBlockContent(block)}
              </div>
            ))
          ) : (
            // Fallback for old format
            blog.content?.split('\n\n').map((para, i) => (
              <p key={i} style={{
                fontFamily: T.fontBody,
                fontSize: 'clamp(1rem, 2.4vw, 1.15rem)',
                lineHeight: 1.9, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.012em',
              }}>
                {para}
              </p>
            ))
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '5rem', flexWrap: 'wrap' }}>
          {(blog.tags?.length > 0 ? blog.tags : [blog.category]).map((tag) => (
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
        @media (max-width: 640px) {
          .blog-detail-back { font-size: 0.65rem !important; letter-spacing: 0.15em !important; }
          .blog-detail-share { padding: 0.5rem !important; }
        }
      `}</style>
    </div>
  )
}
