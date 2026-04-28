import React, { useState, useMemo, useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import BlogCard from './BlogCard'
import { apiFetch } from '../lib/api'
import './BlogList.css'

const BlogList = ({ onBack, focusSearch = false }) => {
  const [query, setQuery] = useState('')
  const [blogs, setBlogs] = useState([])
  const searchInputRef = useRef(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await apiFetch('/blogs')
        setBlogs(data)
      } catch (err) {
        console.error('Error finding blogs', err)
      }
    }

    fetchBlogs()
  }, [])

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
        <div className="blog-header-top">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft className="back-arrow" size={16} aria-hidden="true" />
            Home
          </button>
          <span className="blog-count">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        <div className="blog-hero-copy">
          <h1 className="blog-title">Curated Entries</h1>
          <p className="blog-subtitle">
            Search or browse the latest posts in the CodeCell community.
          </p>
        </div>
      </header>

      <div className="blog-search-row">
        <label className="blog-search-label" htmlFor="blog-search">
          Search archive
        </label>
        <input
          id="blog-search"
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

export default BlogList
