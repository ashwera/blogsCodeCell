import React from 'react'
import { Link } from 'react-router-dom'
import './FeaturedCard.css'

const FeaturedCard = ({ id, title, category, date, excerpt, imageIndex }) => (
  <Link to={`/blogs/${id}`} className="featured-card">
    <div className="featured-visual">
      <div className={`placeholder-image pattern-${imageIndex % 5}`} />
      <div className="featured-overlay" />
    </div>
    <div className="featured-content">
      <div className="featured-top">
        <span className="featured-label">Featured</span>
        <span className="featured-category">{category || 'Uncategorized'}</span>
      </div>
      <h2 className="featured-title">{title}</h2>
      {excerpt && <p className="featured-excerpt">{excerpt}</p>}
      <div className="featured-meta">
        <span className="featured-date">{date}</span>
        <span className="featured-arrow">Read →</span>
      </div>
    </div>
  </Link>
)

export default FeaturedCard
