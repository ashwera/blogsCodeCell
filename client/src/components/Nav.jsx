import React from 'react'
import { NavLink } from 'react-router-dom'
import './Nav.css'

const Nav = () => {
  return (
    <header className="top-nav">
      <button 
        className="brand brand-btn" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        codecell blogs
      </button>
      <nav className="nav-tabs">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          .home
        </NavLink>
        <NavLink to="/blogs" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          .blogs
        </NavLink>
        <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          .submit
        </NavLink>
      </nav>
    </header>
  )
}

export default Nav
