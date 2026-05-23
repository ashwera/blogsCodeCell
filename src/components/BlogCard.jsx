import React from 'react';
import { Link } from 'react-router-dom';
import './BlogCard.css';

const BlogCard = ({ id, title, category, date, imageIndex }) => {
  return (
    <Link to={`/blogs/${id}`} className="blog-card">
      <div className="card-visual">
        <div className={`placeholder-image pattern-${imageIndex % 3}`}></div>
      </div>
      <div className="card-content">
        <div className="card-meta">
          <span className="card-category">{category}</span>
          <span className="card-date">{date}</span>
        </div>
        <h3 className="card-title">{title}</h3>
      </div>
    </Link>
  );
};

export default BlogCard;
