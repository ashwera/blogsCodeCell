import React, { useState, useMemo, useEffect, useRef } from 'react'
import BlogCard from './BlogCard'
import { apiFetch } from '../lib/api'
import './BlogList.css'

/* ── Live endpoints replace dummy data ── */

const BlogList = ({ onBack, focusSearch = false }) => {
  const [query, setQuery] = useState('')
  const [blogs, setBlogs] = useState([])
  const searchInputRef = useRef(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await apiFetch('/blogs');
        setBlogs(data);
      } catch (err) {
        console.error('Error finding blogs', err);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    if (!query.trim()) return blogs
    const normalized = query.toLowerCase()
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(normalized) ||
        blog.category.toLowerCase().includes(normalized),
    )
  }, [query, blogs])

  useEffect(() => {
    if (focusSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [focusSearch])

  return (
    <div className="blog-list-container container">
      <header className="blog-header">
        <button className="back-btn" onClick={onBack}>
          <span className="back-arrow">←</span> Home
        </button>
        <div>
          <h1 className="blog-title">Curated Entries</h1>
          <p className="blog-subtitle">Search or browse the latest posts in the CodeCell community.</p>
        </div>
      </header>

      <div className="blog-search-row">
        <input
          ref={searchInputRef}
          type="search"
          placeholder="Search blogs by title or category..."
          className="blog-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="blog-grid">
        {filteredBlogs.length === 0 ? (
          <p className="no-results">No blogs found. Try a different search.</p>
        ) : (
          filteredBlogs.map((blog, idx) => (
            <BlogCard
              key={blog._id}
              id={blog._id}
              title={blog.title}
              category={blog.category}
              date={new Date(blog.createdAt).toLocaleDateString()}
              imageIndex={idx}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default BlogList;
