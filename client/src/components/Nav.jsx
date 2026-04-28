import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import './Nav.css'

const Nav = () => {
  const { user } = useAuth()
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
        {!user && (
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            .login
          </NavLink>
        )}
        {user?.role === 'contributor' && (
          <NavLink to="/portal" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            .create
          </NavLink>
        )}
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            .admin dashboard
          </NavLink>
        )}
      </nav>
    </header>
  )
}

export default Nav
